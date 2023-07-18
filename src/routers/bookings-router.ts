import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotels, getRooms } from '@/controllers/hotels-controller';
import { createBooking, editBooking, getBookings } from '@/controllers/bookings-controller';

const bookingRouter = Router();

bookingRouter
    .all('/*', authenticateToken)
    .get('/', getBookings)
    .post('/', createBooking)
    .put('/:bookingId', editBooking)

export { bookingRouter };
