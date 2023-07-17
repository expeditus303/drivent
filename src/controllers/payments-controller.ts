import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import httpStatus from 'http-status';
import paymentService from '@/services/payments-service/index';
import { CreatePaymentBody } from '@/protocols';

export async function getPaymentData(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const ticketId = Number(req.query.ticketId);
  const { userId } = req;

  if (!ticketId) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    const paymentData = await paymentService.getPaymentData(ticketId, userId);

    res.status(httpStatus.OK).send(paymentData);
  } catch (error) {
    next(error);
  }
}

export async function createPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { ticketId, cardData } = req.body;

  if (!ticketId || !cardData) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    const payment = await paymentService.createPayment(ticketId, cardData, userId);
    if (!payment) return res.sendStatus(httpStatus.NOT_FOUND);

    res.status(httpStatus.OK).send(payment);
  } catch (error) {
    next(error);
  }
}
