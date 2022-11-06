import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';
import { GenerateQRDto } from './dto/generateQR.dto';

@Controller('payment-gateway')
export class PaymentGatewayController {
  constructor(private readonly paymentGatewayService: PaymentGatewayService) {}
  @Post('create')
  generateQRPayment(@Body() payload: GenerateQRDto) {
    return this.paymentGatewayService.generateQRPayment(payload);
  }

  @Post('check')
  checkIsUserPaid() {
    return this.paymentGatewayService.checkIsUserPaid();
  }

  @Get('qr/url')
  getQRCodeURL() {
    return this.paymentGatewayService.getQRCodeURL();
  }
}
