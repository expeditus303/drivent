import { notFoundError } from '@/errors';
import bookingsRepository from '@/repositories/booking-repository';

async function getBookings(userId: number) {

  const booking = await bookingsRepository.getBookings(userId);
  if (!booking) throw notFoundError();

  const { id, Room } = booking;
  const { id: roomId, name, capacity, hotelId } = Room;

  const bookingFormatted = {
    id,
    Room: { id: roomId, name, capacity, hotelId },
  };

  return bookingFormatted;
}

const bookingsService = {
  getBookings,
};

export default bookingsService;
