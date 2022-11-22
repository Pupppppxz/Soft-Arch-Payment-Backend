import { Module } from '@nestjs/common';
import { UserPaymentService } from './user-payment.service';
import { UserPaymentController } from './user-payment.controller';
import { PrismaModule } from './../prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { ShopPaymentModule } from 'src/shop-payment/shop-payment.module';
import { forwardRef } from '@nestjs/common/utils';
import { PaymentGatewayModule } from 'src/payment-gateway/payment-gateway.module';

@Module({
  controllers: [UserPaymentController],
  providers: [UserPaymentService],
  imports: [
    PrismaModule,
    HttpModule,
    forwardRef(() => ShopPaymentModule),
    forwardRef(() => PaymentGatewayModule),
  ],
  exports: [UserPaymentService],
})
export class UserPaymentModule {}
