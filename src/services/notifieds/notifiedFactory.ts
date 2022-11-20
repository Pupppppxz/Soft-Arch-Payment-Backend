import { ACCOUNT_TYPE } from 'src/assets/paymentStatic/payment';
import { Notified } from './notified';
import { ShopNotified } from './shopNotified';
import { UserNotified } from './userNotified';

export class NotifiedFactory {
  static getNotified(type: string): Notified {
    if (type === ACCOUNT_TYPE.USER) {
      return new UserNotified();
    }
    return new ShopNotified();
  }
}
