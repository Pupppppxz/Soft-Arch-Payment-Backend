import { Module } from '@nestjs/common';
import { UserPaymentService } from './user-payment.service';
import { UserPaymentController } from './user-payment.controller';
import { PrismaModule } from './../prisma/prisma.module';
// import { APP_FILTER } from '@nestjs/core';
// import { HttpExceptionFilter } from 'src/filter/httpException.filter';

@Module({
  controllers: [UserPaymentController],
  providers: [
    UserPaymentService,
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
  ],
  imports: [PrismaModule],
})
export class UserPaymentModule {}
