import multer from 'multer';

// Configuración de multer para almacenar archivos en memoria
const storage = multer.memoryStorage();

// Filtro para validar que solo se acepten imágenes
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Aceptar solo imágenes
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'));
  }
};

// Configuración de multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite de 5MB por archivo
  },
});

// Middleware específico para la verificación biométrica (selfie e INE)
export const uploadBiometricFiles = upload.fields([
  { name: 'selfie', maxCount: 1 },
  { name: 'ine', maxCount: 1 },
]);
