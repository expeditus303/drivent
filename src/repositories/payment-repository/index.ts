import { prisma } from '@/config';
import { CreatePaymentParams } from '@/protocols';

async function findPaymentbyTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

async function createPayment(paymentData: CreatePaymentParams) {
  return prisma.payment.create({
    data: paymentData,
  });
}

const paymentRepository = {
  findPaymentbyTicketId,
  createPayment,
};

export default paymentRepository;
