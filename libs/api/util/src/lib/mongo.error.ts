import { BadRequestException, HttpException, InternalServerErrorException } from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

export const MONGO_ERROR = (...args: string[]): Record<string, HttpException> => ({
  11000: new BadRequestException(`${args[0]} already exists`),
});

export const handleError = (entity: string) => (source: Observable<unknown>) =>
  source.pipe(
    catchError((err) => {
      if (err instanceof HttpException) {
        return throwError(() => err);
      }
      const exception = MONGO_ERROR(entity)[err.code as string];
      return exception != null
        ? throwError(() => exception)
        : throwError(() => new InternalServerErrorException(err));
    })
  );