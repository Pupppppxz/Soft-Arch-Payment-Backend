import { Module } from '@nestjs/common';
import { ShopPaymentService } from './shop-payment.service';
import { ShopPaymentController } from './shop-payment.controller';
import { PrismaModule } from './../prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { UserPaymentModule } from 'src/user-payment/user-payment.module';
import { forwardRef } from '@nestjs/common/utils';

@Module({
  controllers: [ShopPaymentController],
  providers: [ShopPaymentService],
  imports: [PrismaModule, HttpModule, forwardRef(() => UserPaymentModule)],
  exports: [ShopPaymentService],
})
export class ShopPaymentModule {}
