import { ACCOUNT_TYPE } from 'src/assets/paymentStatic/payment';
import { ShopTransaction } from './shopTransaction';
import { Transaction } from './transaction';
import { UserTransaction } from './userTransaction';

export class TransactionFactory {
  static getTransaction(type: string): Transaction {
    if (type === ACCOUNT_TYPE.USER) {
      return new UserTransaction();
    }
    return new ShopTransaction();
  }
}
