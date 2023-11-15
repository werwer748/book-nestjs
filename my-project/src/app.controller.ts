import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { AppService } from 'src/app.service';

// @UseFilters(HttpExceptionFilter) // 예외필터를 특정 컨트롤러 전체에 적용할 때
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  // @UseFilters(HttpExceptionFilter) // 예외필터를 특정 엔드포인트에 적용할 떄
  @Get('/error')
  error(foo: any): string {
    return foo.bar();
    /*
    요청시 500 서버 에러가 발생.
    Nest의 내장된 예외 필터들을 살펴보면 결국 모두 Error 객체로부터 파생된 것들이다.
    */
  }

  // @UseInterceptors(ErrorsInterceptor) // 인터셉터로 에러 핸들링해보기
  @Get(':id')
  interceptor(@Param('id') id: string) {
    throw new InternalServerErrorException();
  }
}
