import { prisma } from '@/config';
import { CreateTicket } from '@/protocols';

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
            ...ticketData
        }
    })
}

const ticketsRepository = {
  getTicketsTypes,
  findWithTicketbyEnrollmentId,
  createTicket
};

export default ticketsRepository;
