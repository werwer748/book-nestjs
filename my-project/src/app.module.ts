import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import emailConfig from 'src/config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { TypeOrmModule } from '@nestjs/typeorm';
import authConfig from 'src/config/authConfig';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { ExceptionModule } from 'src/common/filter/http-exception.module';
import { LoggingModule } from 'src/common/interceptor/logging.module';
import { BatchModule } from 'src/common/batch/batch.module';

console.log(`${__dirname}/config/env/.${process.env.NODE_ENV}.env`);
@Module({
  imports: [
    // LoggerModule, => 로거를 직접 구현한 경우
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig, authConfig],
      isGlobal: true,
      validationSchema,
    }), // .env
    TypeOrmModule.forRoot({
      // TypeOrmModule을 동적 모듈로 가져온다.
      type: 'mysql', // 연결될 DB 타입
      host: process.env.DATABASE_HOST, // 호스트 주소
      port: 3306, // 포트 번호
      username: process.env.DATABASE_USERNAME, // DB에 연결될 유저명과 패스워드
      password: process.env.DATABASE_PASSWORD,
      database: 'nest_book', // 연결하고자하는 DB 스키마 이름
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // TypeOrm 구동시 인식할 엔티티 경로
      // synchronize: process.env.DATABASE_SYNCRONIZE === 'true', // 소스 코드 기반으로 DB 스키마를 동기화할지 여부.
      // ! 주의: true가 되면 서비스가 실행되고 DB와 연결될때 DB가 초기화 되므로 절대 프로덕션에서는 true로 설정하지 말 것.
      synchronize: true, // 원활한 마이그레이션 테스트를 위해 false로 설정
      migrationsRun: false, // 서버 구동시 작성된 마이그레이션 파일을 기반으로 마이그레이션을 실행할지 여부 - false로 하여 CLI 명령을 직접 입력
      migrations: [__dirname + '/**/migrations/*{.js,.ts}'], // 마이그레이션을 수행할 파일이 관리되는 경로를 설정

      migrationsTableName: 'migrations',
      /*
      TypeOrmModuleOptions 객체
      export declare type TypeOrmModuleOptions = {    
        retryAttempts?: number; - 연결 시 재시도 횟수
        retryDelay?: number; - 재시도 간의 지연 시간. 단위는 ms, 기본값은 3000
        toRetry?: (err: any) => boolean; - 에러발생시 연결을 시도할지 판단하는 함수. 콜백으로 받은 인수 err을 이용해 연결여부를 판단하는 함수를 구현하면 됨.
        autoLoadEntities?: boolean; - 엔티티 자동로드 여부
        keepConnectionAlive?: boolean; - 애플리케이션 종료 후 연결을 유지할지 여부
        verboseRetryLog?: boolean; - 연결 재시도 시 verbose 레벨로 에러 메시지를 보여줄지 여부. (verbose는 상세메시지를 의미함.)
      } & Partial<DataSourceOptions>;
      */
    }),
    ExceptionModule, // 모듈화하여 등록
    LoggingModule, // ExceptionModule과 마찬가지로 의존성 주입을 위해 모듈화하여 등록
    BatchModule,
    // UsersModule에 UsersService, EmailService, AuthService가 등록되어있어서 UsersModule만 import하면 됨
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    // Logger, - 모듈로 등록하기 전..
    // {
    //   provide: APP_FILTER, // 의존성 주입을 위해 커스텀프로바이더로 등록
    //   useClass: HttpExceptionFilter,
    // },
    AppService,
  ],
})
export class AppModule {}

/** middleware로 로그를 출력
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(LoggerMiddleware, Logger2Middleware)
      // users 경로의 GET 요청은 미들웨어를 적용하지 않는다.
      // .exclude({ path: '/users', method: RequestMethod.GET })
      .forRoutes(UsersController);
    
    apply 메서드 원형
    apply(...middleware: (Type<any> | Function)[]): MiddlewareConfigProxy

    forRoutes 메서드 원형
    import { Type } from '../type.interface';
    import { RouteInfo } from './middleware-configuration.interface';
    import { MiddlewareConsumer } from './middleware-consumer.interface';
    import { AuthModule } from './auth/auth.module';
    
    export interface MiddlewareConfigProxy {    
      exclude(...routes: (string | RouteInfo)[]): MiddlewareConfigProxy;    
      forRoutes(...routes: (string | Type<any> | RouteInfo)[]): MiddlewareConsumer;
    }
    - forRoutes의 인수로 문자열 형식의 경로를 직접 주거나, 컨트롤러 클래스 이름을 주어도 되고,
      RouteInfo 객체를 넘길 수도 있다. 보통은 컨트롤러 클래스를 주어 동작하도록 한다.
  }
}

*/

/**
 * winston 로그레벨 일곱 단계
 * error: 0
 * warn: 1
 * info: 2
 * http: 3
 * verbose: 4
 * debug: 5
 * silly: 6
 */
/*
윈스턴 로거 기본 사용 법
    WinstonModule.forRoot({
      transports: [
        transports 옵션을 설정
        new winston.transports.Console({
          로그 레벨을 개발환경에 따라 다르게 지정
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          
          format: winston.format.combine(
            
            로그를 남긴 시각을 함께 표시하도록 한다.
            winston.format.timestamp(),

            어디에서 로그를 남겼는지를 구분하는 appName('MyApp')
            로그를 읽기 쉽도록 하는 옵션인 prettyPrint 옵션을 설정
            nestWinstonModuleUtilities.format.nestLike('MyApp', {
              prettyPrint: true,
              colors: true,
            }),
          ),
        }),
      ],
    }),
*/
