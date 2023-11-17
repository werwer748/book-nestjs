import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import { CreateUserHandler } from 'src/users/command/create-user.handler';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserEventsHandler } from 'src/users/event/user-event.handler';
import { GetUserInfoQueryHandler } from 'src/users/query/get-user-info.handler';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    EmailModule,
    AuthModule,
    CqrsModule,
  ],
  controllers: [UsersController],
  providers: [
    GetUserInfoQueryHandler,
    CreateUserHandler,
    UserEventsHandler,
    UsersService,
    EmailService,
    AuthService,
    Logger,
  ],
})
export class UsersModule {}
