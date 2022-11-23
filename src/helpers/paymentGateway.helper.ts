import { QRShopPayment } from '@prisma/client';
import { QR_ORIGIN } from 'src/httpConfig';
import { GenerateTimeStamp } from './generateTime.helper';

export class PaymentGatewayHelper {
  static async getExpiredTime(timeAmount: number) {
    const expiredTime = new Date();
    const minute = expiredTime.getMinutes() + (timeAmount % 60);
    const hours = expiredTime.getHours() + Math.floor(timeAmount / 60) + 7;
    if (timeAmount % 60 > 0) expiredTime.setMinutes(minute % 60);

    if (timeAmount > 60)
      expiredTime.setHours((hours % 24) + minute >= 60 ? 1 : 0);

    if (hours > 23) expiredTime.setDate(expiredTime.getDate() + 1);
    return GenerateTimeStamp.getCurrentTime(expiredTime);
  }

  static reformatResponseQR(responseObj: QRShopPayment) {
    return {
      QRRef: responseObj.QRRef,
      expiredTime: responseObj.expiredTime,
      amount: responseObj.amount,
      qrURL: QR_ORIGIN + responseObj.qrURL,
      isPaid: responseObj.isPaid,
    };
  }
}
