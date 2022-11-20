import { ShopPayment } from '@prisma/client';
import { ShopTransfer } from 'src/shop-payment/dto/shopTransfer.dto';
import { TransferNotified } from 'src/types';

export class ShopNotifiedHelper {
  static formatTransferNotified(
    shop: ShopPayment,
    shopTransfer: ShopTransfer,
    transactionNumber: string,
    paymentStatus: string,
    date: string,
    phone: string,
  ) {
    const notificationObj: TransferNotified = {
      date: date,
      sourceAccountNumber: shop.accountNumber,
      destBank: shopTransfer.bankNameOther,
      destAccountNumber: shopTransfer.otherAccountNumber,
      destAccountName: shopTransfer.nameOther,
      paymentStatus,
      sourcePhoneNumber: phone,
      amount: shopTransfer.amount,
      fee: shopTransfer.fee,
      availableBalance: shop.balanced,
      transactionNumber,
      destEmail: '',
    };
    return notificationObj;
  }
}
