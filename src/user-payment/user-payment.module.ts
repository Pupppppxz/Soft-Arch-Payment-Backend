import { Module } from '@nestjs/common';
import { UserPaymentService } from './user-payment.service';
import { UserPaymentController } from './user-payment.controller';
import { PrismaModule } from './../prisma/prisma.module';

@Module({
  controllers: [UserPaymentController],
  providers: [UserPaymentService],
  imports: [PrismaModule],
})
export class UserPaymentModule {}
