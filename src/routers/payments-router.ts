import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { createPayment, getPaymentData } from '@/controllers/payments-controller';

const paymentsRouter = Router();

paymentsRouter.all('/*', authenticateToken).get('/', getPaymentData).post('/process', createPayment);

export { paymentsRouter };
