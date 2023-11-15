import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> | Promise<Observable<Response<T>>> {
    return next.handle().pipe(map((data) => ({ data })));
  }
}
/*
    해당 예제 타입에 관해

    NestInterceptor 인터페이스 정의에 Generic으로 T, R 타입 2개를 선언하도록 되어있다.
    
    T는 응답 스트림을 지원하는 Observable 타입이어야하고,
    R은 응답의 Observable로 감싼 타입을 정해줘야 한다.

    T는 any 타입이 될 것이고, R은 Response를 지정했다.
    Response는 우리의 요구 사항에 맞게 정의한 타입.
    즉, data 속성을 가지는 객체가 되도록 강제한다.
*/
