import { Router } from 'express';
import {
  createPayrollAside,
  getUserAsides,
  getAsideById,
  getProjectAsides,
  pauseAside,
  reactivateAside,
  cancelAside,
  updateAsideAmount,
} from '../controllers/aside.controller';

const router = Router();

// CRUD de apartados
router.post('/', createPayrollAside);
router.get('/user/:userId', getUserAsides);
router.get('/:asideId', getAsideById);
router.get('/project/:projectId', getProjectAsides);

// Gestión de estado
router.patch('/:asideId/pause', pauseAside);
router.patch('/:asideId/reactivate', reactivateAside);
router.patch('/:asideId/cancel', cancelAside);

// Actualización
router.patch('/:asideId/amount', updateAsideAmount);

export default router;