import { ShopPayment } from '@prisma/client';
import { BANK_NAME } from 'src/assets/paymentStatic/payment';
import { ShopTransfer } from 'src/shop-payment/dto/shopTransfer.dto';
import { ReceiveNotified } from 'src/types';

export class UserNotified {
  static formatUserReceive(
    balance: number,
    shopTransfer: ShopTransfer,
    shop: ShopPayment,
    date: string,
    status: string,
  ) {
    const notificationObj: ReceiveNotified = {
      date,
      sourceName: shopTransfer.shopName,
      sourceAccountNumber: shop.accountNumber,
      sourceBankName: BANK_NAME.FOUR_QU,
      status,
      destAccountNumber: shopTransfer.otherAccountNumber,
      destAccountName: shopTransfer.nameOther,
      amount: shopTransfer.amount,
      fee: shopTransfer.fee,
      availableBalance: balance,
      destEmail: '',
      destPhoneNumber: '',
    };

    return notificationObj;
  }
}
