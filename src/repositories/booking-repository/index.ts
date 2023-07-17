import { prisma } from '@/config';

function getBookings(userId: number) {
  return prisma.booking.findFirst({
    where: { userId: userId },
    include: { Room: true },
  });
}

const bookingsRepository = {
  getBookings,
};

export default bookingsRepository;
