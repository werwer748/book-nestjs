import { Controller, Post } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Controller('batches')
export class BatchController {
  constructor(private readonly scheduler: SchedulerRegistry) {}
  // SchedulerRegistry를 주입 받는다.

  @Post('/start-sample')
  start() {
    const job = this.scheduler.getCronJob('cronSample');
    // 태스크 서비스에서 등록한 크론잡을 이름을 사용해 가져온다.

    job.start(); // 크론잡 실행
    console.log('start!!!', job.lastDate());
  }

  @Post('/stop-sample')
  stop() {
    const job = this.scheduler.getCronJob('cronSample');
    // 태스크 서비스에서 등록한 크론잡을 이름을 사용해 가져온다.

    job.stop(); // 크론잡 중지
    console.log('stop!!!', job.lastDate());
  }
}
