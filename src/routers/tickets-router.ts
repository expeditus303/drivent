import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { createTicket, getTicketsTypes, getUserTicket } from '@/controllers';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketsTypes)
  .get('/', getUserTicket)
  .post('/', createTicket);

export { ticketsRouter };
