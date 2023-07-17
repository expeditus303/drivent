import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketService from '@/services/tickets-service';

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const ticketsType = await ticketService.getTicketsTypes();

    res.status(httpStatus.OK).send(ticketsType);
  } catch (error) {
    next(error);
  }
}

export async function getUserTicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;

  try {
    const userTicket = await ticketService.getUserTicket(userId);

    res.status(httpStatus.OK).send(userTicket);
  } catch (error) {
    next(error);
  }
}

export async function createTicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { ticketTypeId } = req.body;

  if (!ticketTypeId) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    const ticket = await ticketService.createTicket(userId, ticketTypeId);

    return res.status(httpStatus.CREATED).send(ticket);
  } catch (error) {
    console.log(error);
    next(error);
  }
}
