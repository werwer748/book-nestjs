import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry, // SchedulerRegistry는 객체를 TaskService에 주입한다.
  ) {
    this.addCronJob();
    // TaskService가 생성될 때 크론잡 하나를 ScheduleRegistry에 추가한다.
    //! SchedulerRegistry에 크론잡을 추가만 하는것이지 태스크 스케줄링을 등록하는것이 아니다!
  }

  addCronJob() {
    const name = 'cronSample';

    const job = new CronJob('* * * * * *', () => {
      this.logger.warn(`run! ${name}`);
    });

    this.schedulerRegistry.addCronJob(name, job);

    this.logger.warn(`job ${name} added!`);
  }
}
