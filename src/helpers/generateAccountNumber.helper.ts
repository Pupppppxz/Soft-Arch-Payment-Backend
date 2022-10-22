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
}
