import { Module } from '@nestjs/common';
import { MyLogger } from 'src/common/logger/my-logger.service';

@Module({
  providers: [MyLogger],
  exports: [MyLogger],
})
export class LoggerModule {}
