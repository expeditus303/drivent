import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

type TicketType = 'isRemote' | 'hasHotel' | 'hasNotHotel';

export async function createTicketType(hotel?: TicketType) {
  const isRemote = hotel === 'isRemote';
  const includesHotel = hotel === 'hasHotel';
  const doesNotIncludeHotel = hotel === 'hasNotHotel';

  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: includesHotel ? false : isRemote ? true : faker.datatype.boolean(),
      includesHotel: includesHotel ? true : doesNotIncludeHotel ? false : faker.datatype.boolean(),
    },
  });
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}
