import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PaymentGatewayController } from './payment-gateway.controller';
import { PaymentGatewayService } from './payment-gateway.service';

@Module({
  controllers: [PaymentGatewayController],
  providers: [PaymentGatewayService],
  imports: [
    PrismaModule,
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 10000,
        maxRedirects: 5,
      }),
    }),
  ],
  exports: [PaymentGatewayService],
})
export class PaymentGatewayModule {}
