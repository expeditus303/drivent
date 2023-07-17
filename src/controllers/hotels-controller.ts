import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getHotels(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;

  try {
    const hotels = await hotelsService.getHotels(userId);

    res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    next(error)
  }
}

export async function getRooms(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const hotelId = +req.params.hotelId;

  try {
    const rooms = await hotelsService.getRooms(userId, hotelId);

    res.status(httpStatus.OK).send(rooms);
  } catch (error) {
    next(error)
    
  }
}
