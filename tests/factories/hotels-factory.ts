import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotels() {
  const hotels = [];
  const numberOfHotels = 3;

  for (let i = 0; i < numberOfHotels; i++) {
    hotels.push({
      name: faker.company.companyName(),
      image: faker.image.cats(),
    });
  }

  return prisma.hotel.createMany({ data: hotels });
}

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: 'Majestic Palace Hotel',
      image: 'https://loremflickr.com/cache/resized/65535_52714272205_d367518fbd_b_640_480_nofilter.jpg',
    },
  });
}

export async function createRooms(hotelId: number) {
  const rooms = [];
  const numberOfRooms = 3;

  for (let i = 0; i < numberOfRooms; i++) {
    const name = faker.company.companyName();
    const capacity = faker.datatype.number({ min: 1, max: 5 });
    rooms.push({
      name,
      capacity,
      hotelId,
    });
  }

  return prisma.room.createMany({ data: rooms });
}

export async function createRoom(hotelId: number) {
    const name = faker.company.companyName();
    const capacity = faker.datatype.number({ min: 1, max: 5 });

    const roomData = {
      name,
      capacity,
      hotelId,
    };

  return prisma.room.create({ data: roomData });
}
