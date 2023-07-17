import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotels, getRooms } from '@/controllers/hotels-controller';
import { getBookings } from '@/controllers/bookings-controller';

const bookingRouter = Router();

bookingRouter
    .all('/*', authenticateToken)
    .get('/', getBookings)

export { bookingRouter };
