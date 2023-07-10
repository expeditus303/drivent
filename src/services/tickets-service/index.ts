import { TicketStatus } from '@prisma/client';
import { notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/ticket-repository';

async function getTicketsTypes() {
  const ticketsType = await ticketsRepository.getTicketsTypes();

  if (!ticketsType) throw notFoundError();

  return ticketsType;
}

async function getUserTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findWithTicketbyEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  return ticket;
}

async function createTicket(userId: number, ticketTypeId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticketData = {
    ticketTypeId,
    enrollmentId: enrollment.id,
    status: TicketStatus.RESERVED,
  };

  await ticketsRepository.createTicket(ticketData);

  const ticket = await ticketsRepository.findWithTicketbyEnrollmentId(enrollment.id);

  // const ticketTest = {
  //   id: ticket.id,
  //   status: ticket.status,
  //   ticketTypeId: ticket.ticketTypeId,
  //   enrollmentId: ticket.enrollmentId,
  //   TicketType: {
  //     id: ticket.TicketType.id,
  //     name: ticket.TicketType.name,
  //     price: ticket.TicketType.price,
  //     isRemote: ticket.TicketType.isRemote,
  //     includesHotel: ticket.TicketType.includesHotel,
  //     createdAt: ticket.TicketType.createdAt,
  //     updatedAt: ticket.TicketType.updatedAt,
  //   },
  //   createdAt: ticket.createdAt,
  //   updatedAt: ticket.updatedAt,
  // };

  return ticket
}

const ticketService = {
  getTicketsTypes,
  getUserTicket,
  createTicket,
};

export default ticketService;
