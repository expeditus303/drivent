import { ApplicationError } from '@/protocols';

export function paymentRequiredError(message: string = 'Payment Required'): ApplicationError {
  return {
    name: 'paymentRequiredError',
    message,
  };
}
