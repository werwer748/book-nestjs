import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [EmailModule],
  controllers: [UsersController],
  providers: [UsersService, EmailService],
})
export class UsersModule {}
