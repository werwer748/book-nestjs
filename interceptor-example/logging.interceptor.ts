import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
// 1. @nesstjs/common 패키지의 NestInterceptor를 구현한 클래스
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    // 2. NestInterceptor 인터페이스의 intercept 메서드 구현
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log('Before...'); // 3 요청 전 로그를 출력

    const now = Date.now();
    return next.handle().pipe(
      // 4 요청 후 로그를 출력
      tap(() => console.log(`After... ${Date.now() - now}ms`)), // 4
    );
  }
}

/*
NestInterceptor의 정의

    export interface NestInterceptor<T = any, R = any> {    
        intercept(context: ExecutionContext, next: CallHandler<T>): Observable<R> | Promise<Observable<R>>;
    }
    
    export interface CallHandler<T = any> {    
        handle(): Observable<T>;
    }

CallHandler는 handle 메서드를 구현해야 한다.
handle 메서드는 RxJS의 Observable로 구현되어 있다.
handle 메서드를 호출하지 않으면 라우터 핸들러가 동작하지 않는다.

응답을 다루는 방법은 RxJS에서 제공하는 여러가지 메서드로 구현이 가능하다고...
*/
