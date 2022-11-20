import { ACCOUNT_TYPE } from 'src/assets/paymentStatic/payment';

export class GenerateAccountNumber {
  static characters = '1234567890';

  static GetUserAccountNumber() {
    let accNum = '0';

    for (let i = 0; i < 9; i++) {
      accNum += this.characters.charAt(Math.floor(Math.random() * 10));
    }

    return accNum;
  }

  static GetShopAccountNumber() {
    let accNum = '5';

    for (let i = 0; i < 9; i++) {
      accNum += this.characters.charAt(Math.floor(Math.random() * 10));
    }

    return accNum;
  }

  static CheckIsDestinationType(accountNumber: string): string {
    if (accountNumber.charAt(0) === '0') {
      return ACCOUNT_TYPE.USER;
    } else if (accountNumber.charAt(0) === '5') {
      return ACCOUNT_TYPE.SHOP;
    }
    return ACCOUNT_TYPE.UNKNOWN;
  }
}
