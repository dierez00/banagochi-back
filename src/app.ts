import express from 'express';
import asideRoutes from './routes/aside.route';
import projectRoutes from './routes/project.route';
import transactionRoutes from './routes/transactions.route';
import bodyParser from 'body-parser';
import cors from 'cors';

// Import User model to register it with Mongoose before populate() calls
import './models/user.model';

const app = express();

// Configuración de CORS
const whitelist = [
  'http://localhost:5173',
  'http://localhost:8080',
  'https://localhost:8081'
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

app.use(bodyParser.json());

app.use('/api/asides', asideRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/transactions', transactionRoutes);

export default app;
