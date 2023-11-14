import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

// 예외 필터는 전역 필터 하나만 가지도록 하는 것이 일반적이다.

@Catch() // Catch 데코레이터는 처리되지 않은 모든 예외를 잡으려고 할 때 사용한다.
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const stack = exception.stack;

    if (!(exception instanceof HttpException)) {
      // Nest에서 HttpException을 상속받는 클래스들로 제공.
      // HttpException이 아닌 예외는 알 수 없는 에러이므로 InternalServer ErrorException로 처리되도록 했습니다.
      exception = new InternalServerErrorException();
    }

    const response = (exception as HttpException).getResponse();

    const log = {
      timestamp: new Date(),
      url: req.url,
      response,
      stack,
    };

    // console.log(log);
    this.logger.log(log);

    res.status((exception as HttpException).getStatus()).json(response);
  }
}
