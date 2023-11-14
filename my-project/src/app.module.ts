import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import emailConfig from 'src/config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { TypeOrmModule } from '@nestjs/typeorm';

console.log(`${__dirname}/config/env/.${process.env.NODE_ENV}.env`);
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig],
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
      synchronize: process.env.DATABASE_SYNCRONIZE === 'true', // 소스 코드 기반으로 DB 스키마를 동기화할지 여부.
      // ! 주의: true가 되면 서비스가 실행되고 DB와 연결될때 DB가 초기화 되므로 절대 프로덕션에서는 true로 설정하지 말 것.
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
    UsersModule, // UsersModule에 UsersService, EmailService가 등록되어있어서 UsersModule만 import하면 됨
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
