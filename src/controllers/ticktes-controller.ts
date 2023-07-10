import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketService from '@/services/tickets-service';

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketsType = await ticketService.getTicketsTypes();

    res.status(httpStatus.OK).send(ticketsType);
  } catch (error) {
    res.status(httpStatus.NO_CONTENT).send(error);
  }
}

export async function getUserTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const userTicket = await ticketService.getUserTicket(userId);

    res.status(httpStatus.OK).send(userTicket);
  } catch (error) {
    res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId } = req.body;

  if (!ticketTypeId) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    const ticket = await ticketService.createTicket(userId, ticketTypeId);

    res.status(httpStatus.CREATED).send(ticket);
  } catch (error) {
    res.sendStatus(httpStatus.NOT_FOUND);
  }
}
