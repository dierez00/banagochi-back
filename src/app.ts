import express, { Application } from 'express';
import cors from 'cors';

import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.route';
import menuRoutes from './routes/menu.routes';
import creditCardRoutes from './routes/creditCard.routes';

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔓 CORS completamente abierto - Acepta cualquier origen
app.use(cors({
  origin: '*', // Permite cualquier origen
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 86400 // 24 horas de caché para preflight
}));

// Middleware adicional para headers CORS manuales (por si acaso)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Manejar preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Banagochi API is running',
    timestamp: new Date().toISOString()
  });
});

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cards', creditCardRoutes);

// Ruta 404
app.use((_req, res) => {
  res.status(404).json({ 
    message: 'Route not found'
  });
});

export default app;