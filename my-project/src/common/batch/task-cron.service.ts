import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  // @Cron('* * * * * *', { name: 'cronTask' }) // 매 초마다 실행
  // @Cron(new Date(Date.now() + 3 * 1000)) // 앱이 실행되고 3초 후 한번만 실행
  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_1AM) // 매주 월요일부터 금요일까지 매일 새벽 1시에 실행
  handleCron() {
    this.logger.log('Task Called');
  }
}
