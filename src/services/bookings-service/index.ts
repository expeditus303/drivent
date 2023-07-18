import { notFoundError } from '@/errors';
import { forbiddenError } from '@/errors/forbidden-error';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import roomRepository from '@/repositories/room-repository';

async function getBookings(userId: number) {
  const booking = await bookingRepository.getBookings(userId);
  if (!booking) throw notFoundError();

  const { id, Room } = booking;
  const { id: roomId, name, capacity, hotelId } = Room;

  const bookingFormatted = {
    id,
    Room: { id: roomId, name, capacity, hotelId },
  };

  return bookingFormatted;
}

async function createBooking(userId: number, roomId: number) {
  const ticketData = await enrollmentRepository.getEnrollmentWithTicketAndTicketType(userId);

  const { status } = ticketData.Ticket;
  const { isRemote, includesHotel } = ticketData.Ticket.TicketType;

  const isPaid = status === 'PAID';
  const inPersonTicket = isRemote === false;
  const hasHotelIncluded = includesHotel === true;

  if (!isPaid || !inPersonTicket || !hasHotelIncluded) throw forbiddenError();

  const roomData = await roomRepository.getRoomData(roomId);
  if (!roomData) throw notFoundError();

  const bookingsCount = await bookingRepository.getBookingsCount(roomId)
  
  const { capacity } = roomData
  if(capacity <= bookingsCount) throw forbiddenError()

  const booking = await bookingRepository.createBooking(userId, roomId)

  const bookingId = { bookingId: booking.id };

  return bookingId
}

const bookingsService = {
  getBookings,
  createBooking,
};

export default bookingsService;
