import { ConsoleLogger } from '@nestjs/common';

// 처음부터 로그를 재정의하는 것이 아니라, ConsoleLogger를 상속받는게 더 낫다.
export class MyLogger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    // eslint-disable-next-line prefer-rest-params
    super.error.apply(this, arguments);
    this.doSomething();
  }

  private doSomething() {
    // 여기에 로깅에 관련된 부가 로직을 추가할 수 있다.
  }
}
