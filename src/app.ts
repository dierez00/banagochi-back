import express from 'express';
import asideRoutes from './routes/aside.route';
import projectRoutes from './routes/project.route';
import transactionRoutes from './routes/transactions.route';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

app.use('/api/asides', asideRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/transactions', transactionRoutes);

export default app;
