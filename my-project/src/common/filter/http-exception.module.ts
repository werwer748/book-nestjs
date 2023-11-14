import { Logger, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './http-exception.filter';

@Module({
  providers: [
    Logger,
    {
      provide: APP_FILTER, // 의존성 주입을 위해 커스텀프로바이더로 등록
      useClass: HttpExceptionFilter,
    },
  ],
})
export class ExceptionModule {}
