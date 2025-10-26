import express, { Application } from 'express';
import cors from 'cors';

import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.route';
import menuRoutes from './routes/menu.routes';
import creditCardRoutes from './routes/creditCard.routes'; // agregado

const app: Application = express();

// Middlewares
app.use(express.json());

// Configuración de CORS
const whitelist = [
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:8081
];

interface CorsCallback {
    (err: Error | null, allow?: boolean): void;
}

interface CorsOptions {
    origin: (origin: string | undefined, callback: CorsCallback) => void;
    credentials: boolean;
}

const corsOptions: CorsOptions = {
    origin: (origin: string | undefined, callback: CorsCallback): void => {
        // Permitir requests sin origin (como Postman) o que estén en la whitelist
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS policy: Origin not allowed'));
        }
    },
    credentials: true,          // Si usas cookies o Authorization headers
};

app.use(cors(corsOptions));

// Preflight para todas las rutas
app.options('*', cors({
  origin: whitelist,
  credentials: true,
}));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cards', creditCardRoutes); // registrado

export default app;
