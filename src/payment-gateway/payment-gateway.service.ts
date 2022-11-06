import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PAYMENT_NOT_ALLOW } from 'src/assets/httpMessage/shopPayment.label';
import { FEE } from 'src/assets/paymentStatic/payment';
import { GenerateTimeStamp } from 'src/helpers/generateTime.helper';
import { PaymentGatewayHelper } from 'src/helpers/paymentGateway.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { GenerateQRDto } from './dto/generateQR.dto';
import { QRPayload } from './entries/QRPayload.entries';

@Injectable()
export class PaymentGatewayService {
  constructor(private prisma: PrismaService) {}

  async generateQRPayment(qrBody: GenerateQRDto) {
    const timeExpired = await PaymentGatewayHelper.getExpiredTime(
      qrBody.timeAmount,
    );
    const shopPayment = await this.prisma.shopPayment.findFirst({
      where: {
        accountNumber: qrBody.accountNumber,
      },
      select: {
        isAllowPayment: true,
      },
    });
    if (!shopPayment?.isAllowPayment) {
      throw new HttpException(PAYMENT_NOT_ALLOW, HttpStatus.BAD_REQUEST);
    }
    const qrPayload = new QRPayload(
      qrBody.accountName,
      qrBody.accountNumber,
      qrBody.amount,
      FEE,
      timeExpired,
    );
    const qrURL = await PaymentGatewayHelper.generateQR(qrPayload);
    console.log(qrURL);
    // const qrObj = await this.prisma.qRShopPayment.create({
    //   data: {
    //     accountNumber: qrBody.accountNumber,
    //     amount: qrBody.amount,
    //     expiredTime: timeExpired,
    //     qrURL: '',
    //   },
    // });
    // console.log('====================================');
    // console.log(qrObj);
    // console.log('====================================');
    return {
      timestamp: GenerateTimeStamp.getCurrentTime(),
      statusCode: HttpStatus.OK,
      // message: SUCCESS_TRANSFER_TO_SAME_BANK,
    };
  }

  async checkIsUserPaid() {
    return 0;
  }

  async getQRCodeURL() {
    return 0;
  }
}
