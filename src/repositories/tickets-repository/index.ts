import { prisma } from '@/config';
import { CreateTicket } from '@/protocols';
import { TicketStatus } from '@prisma/client';

async function getTicketsTypes() {
  return prisma.ticketType.findMany();
}

async function findWithTicketbyEnrollmentId(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: { enrollmentId },
    include: {
      TicketType: true,
    },
  });
}

async function createTicket(ticketData: CreateTicket) {
  return prisma.ticket.create({
    data: {
      ...ticketData,
    },
  });
}

async function getTicketById(id: number) {
  return prisma.ticket.findFirst({
    where: {
      id,
    },
  });
}

async function getTicketWithType(ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      TicketType: true,
    },
  });
}

async function processPayment(ticketId: number) {
  return prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: TicketStatus.PAID,
    },
  });
}

const ticketsRepository = {
  getTicketsTypes,
  findWithTicketbyEnrollmentId,
  createTicket,
  getTicketById,
  getTicketWithType,
  processPayment,
};

export default ticketsRepository;
