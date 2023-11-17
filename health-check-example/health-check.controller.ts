import { Controller, Get } from '@nestjs/common';
import { DogHealthIndicator } from './dog-health.indicator';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health-check')
export class HealthCheckController {
  constructor(
    private http: HttpHealthIndicator,
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private dogHealthIndicator: DogHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      () => this.db.pingCheck('database'), // db 헬스 체크
      () => this.dogHealthIndicator.isHealthy('dog'), // dog 헬스 체크
    ]);
  }
}
