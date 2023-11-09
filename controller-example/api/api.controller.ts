import { Controller, Get, HostParam } from '@nestjs/common';

// API 버저닝을 하는 방법중 하위 도메인을 이용하는 방법을 많이 사용하는데
// @HostParam 을 활용한 하위 도메인 라우팅으로 쉽게 API를 버전별로 분리할 수 있다.
@Controller({ host: ':version.api.localhost' }) // 하위 도메인의 경우 host 옵션을 사용
export class ApiController {
  @Get()
  index(@HostParam('version') version: string): string {
    console.log('version 확인:::', version);
    // host param이 없는 경우 기존 도메인으로 요청이 처리됨.
    return `Hello, API ${version}`; // 같은 루트경로의 다른 응답
  }
}
