import { Request, Response, NextFunction } from 'express';
import FormData from 'form-data';
import axios from 'axios';
import { User } from '../models/userModel';
import dotenv from 'dotenv';

dotenv.config();

const biometric_api = process.env.BIOMETRIC_API;

interface BiometricResponse {
  status: string;
  score: number;
  cosine_similarity: number;
  model: string;
}

// Constantes de umbral para la verificación
const SCORE_THRESHOLD = 0.600;
const COSINE_SIMILARITY_THRESHOLD = 0.400;

/**
 * Middleware para verificar la identidad biométrica del usuario
 * Compara la selfie con la foto del INE usando IA
 */
export const verifyBiometric = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Verificar que los archivos existen en la petición
    if (!req.files || typeof req.files !== 'object') {
      res.status(400).json({
        message: 'Se requieren los archivos selfie e INE para la verificación biométrica',
      });
      return;
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    const selfieFile = files['selfie']?.[0];
    const ineFile = files['ine']?.[0];

    if (!selfieFile || !ineFile) {
      res.status(400).json({
        message: 'Se requieren ambos archivos: selfie e INE',
      });
      return;
    }

    // Crear FormData para enviar a la API de verificación
    const formData = new FormData();
    formData.append('selfie', selfieFile.buffer, {
      filename: selfieFile.originalname,
      contentType: selfieFile.mimetype,
    });
    formData.append('ine', ineFile.buffer, {
      filename: ineFile.originalname,
      contentType: ineFile.mimetype,
    });

    // Realizar petición a la API de verificación biométrica
    const response = await axios.post<BiometricResponse>(
      `${biometric_api}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 40000, // 30 segundos de timeout
      }
    );

    const { status, score, cosine_similarity, model } = response.data;

    // Validar que la respuesta sea exitosa
    if (status !== 'ok') {
      res.status(400).json({
        message: 'Error en la verificación biométrica',
        details: response.data,
      });
      return;
    }

    // Verificar que los scores cumplan con los umbrales mínimos
    if (score < SCORE_THRESHOLD || cosine_similarity < COSINE_SIMILARITY_THRESHOLD) {
      res.status(403).json({
        message: 'La verificación biométrica no cumple con los requisitos mínimos',
        score,
        cosine_similarity,
        required: {
          score: SCORE_THRESHOLD,
          cosine_similarity: COSINE_SIMILARITY_THRESHOLD,
        },
      });
      return;
    }

    // Guardar los resultados de la verificación en el request para uso posterior
    req.biometricVerification = {
      verified: true,
      score,
      cosine_similarity,
      model,
      timestamp: new Date(),
    };

    // Verificación exitosa, continuar con el siguiente middleware/controlador
    next();
  } catch (error: unknown) {
    console.error('Error en verificación biométrica:', error);

    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        res.status(408).json({
          message: 'Timeout en la verificación biométrica. Intente nuevamente.',
        });
        return;
      }

      if (error.response) {
        res.status(error.response.status).json({
          message: 'Error en el servicio de verificación biométrica',
          details: error.response.data,
        });
        return;
      }
    }

    res.status(500).json({
      message: 'Error interno en la verificación biométrica',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Middleware condicional que solo verifica biométricamente en dispositivos nuevos
 * Primero verifica si el dispositivo existe en la base de datos
 */
export const verifyBiometricForNewDevice = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, deviceId } = req.body;

    // Si no hay email o deviceId, no podemos verificar
    if (!email || !deviceId) {
      // Continuamos sin verificación, el controlador de login manejará los errores
      return next();
    }

    // Buscar el usuario
    const user = await User.findOne({ email });

    // Si el usuario no existe, continuar (el login fallará de todas formas)
    if (!user) {
      return next();
    }

    // Verificar si el dispositivo ya existe
    const deviceExists = user.devices.some(d => d.deviceId === deviceId);

    // Si es un dispositivo nuevo, requerir verificación biométrica
    if (!deviceExists) {
      req.isNewDevice = true;

      // Verificar que se hayan enviado los archivos
      if (!req.files || typeof req.files !== 'object') {
        res.status(400).json({
          message: 'Dispositivo nuevo detectado. Se requiere verificación biométrica (selfie e INE)',
          isNewDevice: true,
          requiresBiometric: true,
        });
        return;
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const selfieFile = files['selfie']?.[0];
      const ineFile = files['ine']?.[0];

      if (!selfieFile || !ineFile) {
        res.status(400).json({
          message: 'Dispositivo nuevo detectado. Se requieren ambos archivos: selfie e INE',
          isNewDevice: true,
          requiresBiometric: true,
        });
        return;
      }

      // Aplicar verificación biométrica
      return verifyBiometric(req, res, next);
    }

    // Si no es dispositivo nuevo, continuar sin verificación
    req.isNewDevice = false;
    next();
  } catch (error) {
    console.error('Error verificando dispositivo:', error);
    res.status(500).json({
      message: 'Error verificando dispositivo',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Extender la interfaz Request para incluir los datos de verificación biométrica
declare global {
  namespace Express {
    interface Request {
      biometricVerification?: {
        verified: boolean;
        score: number;
        cosine_similarity: number;
        model: string;
        timestamp: Date;
      };
      isNewDevice?: boolean;
    }
  }
}
