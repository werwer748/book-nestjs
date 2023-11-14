import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
    /**
     * ExecutionContext를 인수로 받음
     * ExecutionContext는 ArgumentsHost를 상속받는데 요청과 응답에 대한 정보를 가지고 있다.
     * 여기서 switchToHttp()를 통해 http 요청과 응답에 대한 정보를 가져올 수 있다.
     */
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: any) {
    // 여기서 인가를 진행
    return false;
  }
}
/**
    export interface ExecutionContext extends ArgumentsHost {    
        getClass<T = any>(): Type<T>;   
        getHandler(): Function;
    }
    
    export interface ArgumentsHost {    
        getArgs<T extends Array<any> = any[]>(): T;    
        getArgByIndex<T = any>(index: number): T;    
        switchToRpc(): RpcArgumentsHost;    
        switchToHttp(): HttpArgumentsHost;    
        switchToWs(): WsArgumentsHost;    
        getType<TContext extends string = ContextType>(): TContext;
    }
    
    export interface HttpArgumentsHost {    
        getRequest<T = any>(): T;    
        getResponse<T = any>(): T;    
        getNext<T = any>(): T;
    }
 */
