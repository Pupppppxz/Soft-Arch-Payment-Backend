import { Module } from '@nestjs/common';
import { UserPaymentService } from './user-payment.service';
import { UserPaymentController } from './user-payment.controller';
import { PrismaModule } from './../prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { ShopPaymentModule } from 'src/shop-payment/shop-payment.module';
import { forwardRef } from '@nestjs/common/utils';

@Module({
  controllers: [UserPaymentController],
  providers: [UserPaymentService],
  imports: [PrismaModule, HttpModule, forwardRef(() => ShopPaymentModule)],
  exports: [UserPaymentService],
})
export class UserPaymentModule {}
