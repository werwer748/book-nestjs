import { Injectable, Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  @Timeout('timeoutTask', 5000) // 앱 실행 5초 후 한번만 실행
  handleCron() {
    this.logger.log('Task Called by timeout');
  }
}
