import { prisma } from "@/config";

function getRoomData(roomId: number) {
  return prisma.room.findUnique({
    where: {
      id: roomId,
    },
    include: {
      Booking: true,
    },
  });
}

const roomRepository = {
    getRoomData
}

export default roomRepository
