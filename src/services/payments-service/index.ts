import { notFoundError, unauthorizedError } from '@/errors';
import { badRequest } from '@/errors/bad-request-error';
import { CardDataParams, CreatePaymentBody, CreatePaymentParams } from '@/protocols';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentRepository from '@/repositories/payment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getPaymentData(ticketId: number, userId: number) {
  const ticket = await ticketsRepository.getTicketById(ticketId);

  if (!ticket) throw notFoundError();

  const enrollment = await enrollmentRepository.findById(ticket.enrollmentId);

  if (!enrollment) throw notFoundError();

  if (enrollment.userId !== userId) throw unauthorizedError();

  const payment = await paymentRepository.findPaymentbyTicketId(ticketId);

  if (!payment) throw notFoundError();

  return payment;
}

async function createPayment(ticketId: number, cardData: CardDataParams, userId: number) {
  const ticket = await ticketsRepository.getTicketWithType(ticketId);
  if (!ticket) throw notFoundError();

  const enrollment = await enrollmentRepository.findById(ticket.enrollmentId);
  if (!enrollment) throw notFoundError();

  if (enrollment.userId !== userId) throw unauthorizedError();

  const paymentData: CreatePaymentParams = {
    ticketId: ticketId,
    value: ticket.TicketType.price,
    cardIssuer: cardData.issuer,
    cardLastDigits: cardData.number.toString().slice(-4),
  };

  const payment = await paymentRepository.createPayment(paymentData);

  const teste = await ticketsRepository.processPayment(ticketId);

  return payment;
}

const paymentService = {
  getPaymentData,
  createPayment,
};

export default paymentService;
