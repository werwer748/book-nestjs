import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('MyApp', {
              prettyPrint: true,
              colors: true,
            }),
          ),
        }),
      ],
    }),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // class-transformer 를 적용하기 위한 설정
    }),
  );
  //
  // 예외필터를 전역으로 적용 - 의존성 주입에 제약이 있다. 의존성을 주입받고자 한다면 커스텀 프로바이더로 등록한다.
  // app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
/*
전역 로그 설정방법 1
const app = await NestFactory.create(AppModule, {
  logger: false, // 로그를 출력하지 않도록 설정
  logger:
    process.env.NODE_ENV === 'production'
      ? ['error', 'warn', 'log']
      : ['error', 'warn', 'log', 'verbose', 'debug'],
});
  */

/*
전역 로그 설정방법 2
const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(MyLogger));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // class-transformer 를 적용하기 위한 설정
    }),
  );
  await app.listen(3000);
*/
/*
async function bootstrap() {// 시스템 로그에 winston 적용 - 내장로거 대체
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER)); 
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // class-transformer 를 적용하기 위한 설정
    }),
  );
  await app.listen(3000);
}
bootstrap();
*/
