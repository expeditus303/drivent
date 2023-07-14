import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    
    try {
        const hotels = await hotelsService.getHotels(userId)

        res.status(httpStatus.OK).send(hotels)
    } catch (error) {
        res.sendStatus(httpStatus.BAD_REQUEST)
    }
}

export async function getRooms(req: AuthenticatedRequest, res: Response){
    const { userId } = req;
    const hotelId = +req.params.hotelId
    
    try {
        const rooms = await hotelsService.getRooms(userId, hotelId)

        res.status(httpStatus.OK).send(rooms)
    } catch (error) {
        res.sendStatus(httpStatus.BAD_REQUEST)
    }
}