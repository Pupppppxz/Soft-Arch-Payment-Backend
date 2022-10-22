import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserPaymentModule } from './user-payment/user-payment.module';
import { ShopPaymentModule } from './shop-payment/shop-payment.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './actions/filter/httpException.filter';

@Module({
  imports: [PrismaModule, UserPaymentModule, ShopPaymentModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
