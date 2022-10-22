import { Module } from '@nestjs/common';
import { ShopPaymentService } from './shop-payment.service';
import { ShopPaymentController } from './shop-payment.controller';
import { PrismaModule } from './../prisma/prisma.module';

@Module({
  controllers: [ShopPaymentController],
  providers: [ShopPaymentService],
  imports: [PrismaModule],
})
export class ShopPaymentModule {}
