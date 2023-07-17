import { notFoundError } from '@/errors';
import { paymentRequiredError } from '@/errors/payment-required';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelsRepository from '@/repositories/hotels-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function listHotels(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findWithTicketbyEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const isTicketUnpaid = ticket.status === 'RESERVED';
  const isRemoteTicket = ticket.TicketType.isRemote;
  const notIncludesHotel = !ticket.TicketType.includesHotel;

  if (isTicketUnpaid || isRemoteTicket || notIncludesHotel) {
    throw paymentRequiredError();
  }

  return;
}

async function getHotels(userId: number) {
  await listHotels(userId);

  const hotels = await hotelsRepository.getHotels();
  if(hotels.length === 0) throw notFoundError()

  return hotels;
}

async function getRooms(userId: number, hotelId: number) {
  await listHotels(userId);

  const rooms = await hotelsRepository.getRooms(hotelId);
  if(!rooms) throw notFoundError()

  return rooms;
}

const hotelsService = {
  getHotels,
  getRooms,
};

export default hotelsService;
