import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';
import { GenerateQRDto } from './dto/generateQR.dto';
import { QRDto } from './dto/QR.dto';
import { RemoveQRDto } from './dto/removeQR.dto';

@Controller('payment-gateway')
export class PaymentGatewayController {
  constructor(private readonly paymentGatewayService: PaymentGatewayService) {}
  @Post('create')
  generateQRPayment(@Body() payload: GenerateQRDto) {
    return this.paymentGatewayService.generateQRPayment(payload);
  }

  @Post('check')
  checkIsUserPaid(@Body() payload: QRDto) {
    return this.paymentGatewayService.checkIsUserPaid(payload);
  }

  @Get('qr/url')
  getQRCodeURL(@Body() payload: QRDto) {
    return this.paymentGatewayService.getQRCodeURL(payload);
  }

  @Delete('qr')
  deleteQR(@Body() payload: QRDto) {
    return this.paymentGatewayService.removeQR(payload);
  }
}
