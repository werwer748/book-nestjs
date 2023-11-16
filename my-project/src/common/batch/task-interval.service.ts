import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  @Interval('intervalTask', 3000) // 앱 실행 후 3초마다 실행
  handleCron() {
    this.logger.log('Task Called by interval');
  }
}
