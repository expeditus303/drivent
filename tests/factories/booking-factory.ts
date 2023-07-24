import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
        userId,
        roomId
    }
  })
}

// export async function updateBooking(userId: number, roomId: number) {
//   return prisma.booking.update({
//     where: {
//       id: bookingId
//     },
//     data: {
//       roomId
//     }
//   });
// }

export function mockData(userId: number, ticketStatus: string, isRemote: boolean, includesHotel: boolean) {
  return {
    id: 2,
    name: 'Ricardo',
    cpf: '69793271949',
    birthday: '1989-09-26T00:00:00.000Z',
    phone: '11900000000',
    userId: 2,
    createdAt: '2023-07-14T19:49:36.775Z',
    updatedAt: '2023-07-14T19:49:36.776Z',
    Ticket: {
      id: 22,
      ticketTypeId: 3,
      enrollmentId: 2,
      status: ticketStatus,
      createdAt: '2023-07-17T10:52:52.000Z',
      updatedAt: '2023-07-17T13:58:26.906Z',
      TicketType: {
        id: 3,
        name: 'Black Sabbath',
        price: 12000,
        isRemote: isRemote,
        includesHotel: includesHotel,
        createdAt: '2023-07-14T17:03:18.000Z',
        updatedAt: '2023-07-14T17:03:18.000Z',
      },
    },
  };
}

export function mockRoomData(userId: number, roomId: number, roomCapacity: number) {
  return {
    id: roomId,
    name: '402-B',
    capacity: roomCapacity,
    hotelId: 7,
    createdAt: '2023-07-17T18:26:38.000Z',
    updatedAt: '2023-07-17T18:26:38.000Z',
    Booking: [
      {
        id: 4,
        userId: userId,
        roomId: roomId,
        createdAt: '2023-07-18T15:20:57.041Z',
        updatedAt: '2023-07-21T15:35:13.807Z',
      },
    ],
  };
}