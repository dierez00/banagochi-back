import { Router } from 'express';
import {
  createOneTimeTransaction,
  processPayrollDeductions,
  getUserTransactions,
  getProjectTransactions,
  getUserImpactDashboard,
} from '../controllers/transactions.controller';

const router = Router();

// Transacciones únicas
router.post('/one-time', createOneTimeTransaction);

// Procesamiento automático (cron job)
router.post('/process-payroll', processPayrollDeductions);

// Consultas
router.get('/user/:userId', getUserTransactions);
router.get('/project/:projectId', getProjectTransactions);

// Dashboard de impacto
router.get('/user/:userId/dashboard', getUserImpactDashboard);

export default router;