import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import emailConfig from 'src/config/emailConfig';
import { validationSchema } from './config/validationSchema';

console.log(`${__dirname}/config/env/.${process.env.NODE_ENV}.env`);
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig],
      isGlobal: true,
      validationSchema,
    }), // .env
    UsersModule, // UsersModule에 UsersService, EmailService가 등록되어있어서 UsersModule만 import하면 됨
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
