import { Module } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [],
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
