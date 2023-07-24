import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createPayment,
  generateCreditCardData,
  processPayment,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { prisma } from '@/config';
import app, { init } from '@/app';
import { createHotel, createHotels, createRoom, createRooms } from '../factories/hotels-factory';
import { createBooking } from '../factories/booking-factory';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  whenTokenIsInvalid();

  describe('when token is valid', () => {
    // it('should respond with status 404 when user dont have a booking', async () => {
    //   const user = await createUser();
    //   const token = await generateValidToken(user);
    //   const enrollment = await createEnrollmentWithAddress(user);
    //   const ticketType = await createTicketType('hasHotel');
    //   const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    //   await createPayment(ticket.id, ticketType.price);
    //   await processPayment(ticket.id);
    //   const hotel = await createHotel();
    //   await createRooms(hotel.id);

    //   const response = await server.get(`/booking`).set('Authorization', `Bearer ${token}`);

    //   expect(response.status).toEqual(httpStatus.NOT_FOUND);
    // });

    it('should respond with status 200 and booked room', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType('hasHotel');
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      await processPayment(ticket.id);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const booking = await createBooking(user.id, room.id);

      const response = await server.get(`/booking`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: booking.id,
          Room: {
            id: room.id,
            name: room.name,
            capacity: room.capacity,
            hotelId: room.hotelId,
          },
        }),
      );
    });
  });
});

describe('POST /booking', () => {
  whenTokenIsInvalid();

  describe('when token is valid', () => {
    // it('should respond with status 404 when user dont have a booking', async () => {
    //   const user = await createUser();
    //   const token = await generateValidToken(user);
    //   const enrollment = await createEnrollmentWithAddress(user);
    //   const ticketType = await createTicketType('hasHotel');
    //   const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    //   await createPayment(ticket.id, ticketType.price);
    //   await processPayment(ticket.id);
    //   const hotel = await createHotel();
    //   await createRooms(hotel.id);

    //   const response = await server.get(`/booking`).set('Authorization', `Bearer ${token}`);

    //   expect(response.status).toEqual(httpStatus.NOT_FOUND);
    // });

    it('should respond with status 200 and created booking id', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType('hasHotel');
      console.log(ticketType);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      console.log(ticket);
      await createPayment(ticket.id, ticketType.price);
      await processPayment(ticket.id);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      // const room2 = await createRoom(hotel.id);
      const booking = await createBooking(user.id, room.id);
      // const updateBooking = await updateBooking(user.id, room2.id, booking.id)

      const body = {
        roomId: room.id,
      };

      const response = await server.post(`/booking`).set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual(
        expect.objectContaining({
          bookingId: booking.id
        }),
      );
    });
  });
});

function whenTokenIsInvalid() {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
}
