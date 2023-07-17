import { AuthenticatedRequest } from '@/middlewares';
import bookingsService from '@/services/bookings-service';
import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';

export async function getBookings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;

  try {
    const booking = await bookingsService.getBookings(userId);

    res.status(httpStatus.OK).send(booking);
  } catch (error) {
    next(error);
  }
}
