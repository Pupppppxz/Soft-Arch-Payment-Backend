import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserPaymentModule } from './user-payment/user-payment.module';
import { ShopPaymentModule } from './shop-payment/shop-payment.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './actions/filter/httpException.filter';
import { PaymentGatewayController } from './payment-gateway/payment-gateway.controller';
import { PaymentGatewayService } from './payment-gateway/payment-gateway.service';
import { PaymentGatewayModule } from './payment-gateway/payment-gateway.module';

@Module({
  imports: [
    PrismaModule,
    UserPaymentModule,
    ShopPaymentModule,
    PaymentGatewayModule,
  ],
  controllers: [AppController, PaymentGatewayController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    PaymentGatewayService,
  ],
})
export class AppModule {}
