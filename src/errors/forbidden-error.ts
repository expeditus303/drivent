import { ApplicationError } from '@/protocols';

export function forbiddenError(message: string = 'Forbidden action'): ApplicationError {
  return {
    name: 'ForbiddenError',
    message,
  };
}