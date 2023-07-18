import { prisma } from '@/config';

function getBookings(userId: number) {
  return prisma.booking.findFirst({
    where: { userId: userId },
    include: { Room: true },
  });
}

function getBookingsCount(roomId: number) {
  return prisma.booking.count({
    where: {
      roomId,
    },
  });
}

function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

function editBooking(userId: number, bookingId: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id: bookingId
    },
    data: {
      roomId
    }
  });
}

const bookingRepository = {
  getBookings,
  getBookingsCount,
  createBooking,
  editBooking
};

export default bookingRepository;
