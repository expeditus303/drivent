import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import roomRepository from '@/repositories/room-repository';
import bookingsService from '@/services/bookings-service';
import { mockData, mockRoomData } from '../factories/booking-factory';

describe('bookingsService unit test suite', () => {
  const userId = 2;
  const roomId = 6;
  const notFoundError = {
    name: 'NotFoundError',
    message: 'No result for this search!',
  };
  const forbiddenError = {
    name: 'ForbiddenError',
    message: 'Forbidden action',
  };

  let mockEnrollmentRepo: jest.SpyInstance;
  let mockRoomRepo: jest.SpyInstance;
  let mockBookingRepo: jest.SpyInstance;
  let mockBookingCountRepo: jest.SpyInstance;
  let mockBookingCreateRepo: jest.SpyInstance;

  beforeEach(() => {
    mockEnrollmentRepo = jest.spyOn(enrollmentRepository, 'getEnrollmentWithTicketAndTicketType');
    mockRoomRepo = jest.spyOn(roomRepository, 'getRoomData');
    mockBookingRepo = jest.spyOn(bookingRepository, 'getBookings');
    mockBookingCountRepo = jest.spyOn(bookingRepository, 'getBookingsCount');
    mockBookingCreateRepo = jest.spyOn(bookingRepository, 'createBooking');
  });

  describe('getBookings service', () => {
    it('should throw notFoundError() if user doesnt have a booking', async () => {
      mockBookingRepo.mockResolvedValueOnce(null);

      const promisse = bookingsService.getBookings(userId);

      expect(promisse).rejects.toEqual(notFoundError);
      expect(mockBookingRepo).toHaveBeenCalledWith(userId);
    });

    it('should return booking data if user has a booking', async () => {
      mockBookingRepo.mockResolvedValueOnce({
        id: 2,
        userId: userId,
        roomId: roomId,
        createdAt: '2023-07-18T12:10:07.000Z',
        updatedAt: '2023-07-18T12:10:07.000Z',
        Room: {
          id: roomId,
          name: '302-A',
          capacity: 3,
          hotelId: 7,
          createdAt: '2023-07-17T18:26:38.000Z',
          updatedAt: '2023-07-17T18:26:38.000Z',
        },
      });

      const bookingFormatted = {
        id: 2,
        Room: {
          id: roomId,
          name: '302-A',
          capacity: 3,
          hotelId: 7,
        },
      };

      const promisse = await bookingsService.getBookings(userId);

      expect(promisse).toEqual(bookingFormatted);
      expect(mockBookingRepo).toHaveBeenCalledWith(userId);
    });
  });

  describe('createBooking service', () => {
    it('should throw forbiddenError() if ticket isnt paid', async () => {
      mockEnrollmentRepo.mockResolvedValue(mockData(userId, 'RESERVED', false, true));

      const promisse = bookingsService.createBooking(userId, roomId);

      expect(promisse).rejects.toEqual(forbiddenError);
      expect(mockEnrollmentRepo).toHaveBeenCalledWith(userId);
    });

    it('should throw forbiddenError() if ticket is remote', async () => {
      mockEnrollmentRepo.mockResolvedValue(mockData(userId, 'PAID', true, true));

      const promisse = bookingsService.createBooking(userId, roomId);

      expect(promisse).rejects.toEqual(forbiddenError);
      expect(mockEnrollmentRepo).toHaveBeenCalledWith(userId);
    });

    it('should throw forbiddenError() if ticket doesnt includes hotel', async () => {
      mockEnrollmentRepo.mockResolvedValue(mockData(userId, 'PAID', false, false));

      const promisse = bookingsService.createBooking(userId, roomId);

      expect(promisse).rejects.toEqual(forbiddenError);
      expect(mockEnrollmentRepo).toHaveBeenCalledWith(userId);
    });

    it('should throw notFoundError() if room doesnt exist', async () => {
      mockEnrollmentRepo.mockResolvedValue(mockData(userId, 'PAID', false, true));
      mockRoomRepo.mockResolvedValue(null);

      const bookingCreation = bookingsService.createBooking(userId, roomId);

      await expect(bookingCreation).rejects.toEqual(notFoundError);
      expect(mockEnrollmentRepo).toHaveBeenCalledWith(userId);
      expect(mockRoomRepo).toHaveBeenCalledWith(roomId);
    });

    it('should throw forbiddenError() if room is already full', async () => {
      const roomCapacity = 2;
      const bookingsCount = 2;

      mockEnrollmentRepo.mockResolvedValue(mockData(userId, 'PAID', false, true));
      mockRoomRepo.mockResolvedValue(mockRoomData(userId, roomId, roomCapacity));
      mockBookingCountRepo.mockResolvedValue(bookingsCount);

      const bookingCreation = bookingsService.createBooking(userId, roomId);

      await expect(bookingCreation).rejects.toEqual(forbiddenError);
      expect(mockEnrollmentRepo).toHaveBeenCalledWith(userId);
      expect(mockRoomRepo).toHaveBeenCalledWith(roomId);
      expect(mockBookingCountRepo).toHaveBeenCalledWith(roomId);
    });

    it('should create a booking', async () => {
      const roomCapacity = 2;
      const bookingsCount = 1;
      const bookingId = 3;

      mockEnrollmentRepo.mockResolvedValue(mockData(userId, 'PAID', false, true));
      mockRoomRepo.mockResolvedValue(mockRoomData(userId, roomId, roomCapacity));
      mockBookingCountRepo.mockResolvedValue(bookingsCount);

      mockBookingCreateRepo.mockImplementationOnce((): any => {
        return {
          id: bookingId,
          userId,
          roomId,
          createdAt: '2023-07-18T15:20:57.041Z',
          updatedAt: '2023-07-21T15:35:13.807Z',
        };
      });

      const booking = await bookingsService.createBooking(userId, roomId);

      expect(mockEnrollmentRepo).toHaveBeenCalledWith(userId);
      expect(mockRoomRepo).toHaveBeenCalledWith(roomId);
      expect(mockBookingCountRepo).toHaveBeenCalledWith(roomId);
      expect(mockBookingCreateRepo).toHaveBeenCalledWith(userId, roomId);
      expect(booking).toEqual({ bookingId });
    });
  });

  describe('editBooking service', () => {
    it('should throw notFoundError() if ticket isnt paid', async () => {});
  });
});
