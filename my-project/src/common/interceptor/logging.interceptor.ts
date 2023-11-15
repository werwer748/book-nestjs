import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {} // 생성자 주입을 위해 모듈에서 선언될 필요가 있음

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const { method, url, body } = context.getArgByIndex(0);
    //실행 컨텍스트에 포함된 첫번째 객체를 얻어온다. 이 객체로부터 요청 정보를 얻을 수 있다.

    this.logger.log(`Request to ${method} ${url}`); // 요청의 HTTP 메서드와 URL을 로그로 출력

    return next.handle().pipe(
      tap(
        (data) =>
          this.logger.log(
            `Response from ${method} ${url} \n response: ${JSON.stringify(
              data,
            )}`,
          ), // 응답 로그에도 HTTP 메서드와 URL을 함께 응답결과를 출력
      ),
    );
  }
}
