import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { logger3 } from 'src/common/middlewares/logger3.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(logger3); // 미들웨어가 함수로 작성되어 DI 컨테이너를 사용할 수 없다. 즉 프로바이더를 주입받아 사용할 수 없다는 얘기..
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // class-transformer 를 적용하기 위한 설정
    }),
  );
  await app.listen(3000);
}
bootstrap();
