import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { createBooking, editBooking, getBookings } from '@/controllers/booking-controller';

const bookingRouter = Router();

bookingRouter
    .all('/*', authenticateToken)
    .get('/', getBookings)
    .post('/', createBooking)
    .put('/:bookingId', editBooking)

export { bookingRouter };
