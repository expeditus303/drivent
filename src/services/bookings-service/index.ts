import { notFoundError } from '@/errors';
import { forbiddenError } from '@/errors/forbidden-error';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import roomRepository from '@/repositories/room-repository';

async function getBookings(userId: number) {
  const booking = await bookingRepository.getBookings(userId);
  if (!booking) throw notFoundError();

  const { id, Room } = booking;
  const { id: roomId, name, capacity, hotelId,  } = Room;

  const bookingFormatted = {
    id,
    Room: { id: roomId, name, capacity, hotelId },
  };

  return bookingFormatted;
}

async function createBooking(userId: number, roomId: number) {
  await validateTicket(userId, roomId)

  const booking = await bookingRepository.createBooking(userId, roomId);

  const bookingId = { bookingId: booking.id };

  return bookingId;
}

async function editBooking(userId: number, roomId: number, bookingId: number) {
  await validateTicket(userId, roomId)

  const bookingExists = await bookingRepository.findBookingById(bookingId)

  if (bookingExists.userId !== userId || !bookingExists) throw forbiddenError()

  const booking = await bookingRepository.editBooking(userId, bookingId, roomId);

  const updatedBookingId = { bookingId: booking.id };

  return updatedBookingId;
}

async function validateTicket(userId: number, roomId: number) {

  const ticketData = await enrollmentRepository.getEnrollmentWithTicketAndTicketType(userId);

  if(!ticketData.Ticket) throw notFoundError()

  const { status } = ticketData.Ticket;
  const { isRemote, includesHotel } = ticketData.Ticket.TicketType;

  const isPaid = status === 'PAID';
  const inPersonTicket = isRemote === false;
  const hasHotelIncluded = includesHotel === true;

  if (!isPaid || !inPersonTicket || !hasHotelIncluded) throw forbiddenError();

  const roomData = await roomRepository.getRoomData(roomId);

  if (!roomData) throw notFoundError();

  const bookingsCount = await bookingRepository.getBookingsCount(roomId);
  
  const { capacity } = roomData;
  if (capacity <= bookingsCount) throw forbiddenError();

  return
}

const bookingsService = {
  getBookings,
  createBooking,
  editBooking,
};

export default bookingsService;
