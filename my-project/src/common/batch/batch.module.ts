import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BatchController } from 'src/common/batch/batch.controller';
import { TaskService } from 'src/common/batch/task.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  /*
  ScheduleModule은 forRoot() 메서드를 통해 가져온다.
  이 과정에서 Nest는 스케줄러를 초기화하고 앱에 선언한 크론잡(태스크)과 타임아웃 인터벌을 등록한다.

  타임아웃: 스케줄링이 끝나는 시각
  인터벌: 주기적으로 반복되는 시간 간격

  스케줄링은 모든 모듈이 예약된 작업을 로드하고 확인하는
  onApplicationBootstrap 생명주기 훅이 발생할 때 등록된다.
  */
  providers: [TaskService], // TaskService에 실제 수행되는 태스크를 구현
  controllers: [BatchController],
})
export class BatchModule {}
