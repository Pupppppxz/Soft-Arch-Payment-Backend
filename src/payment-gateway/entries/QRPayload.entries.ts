export class QRPayload {
  bankName = '4QU';
  accountName: string;
  accountNumber: string;
  amount: number;
  fee: number;
  type = 'QR_PAYMENT';
  timeExpired: string;
  ref: string;

  constructor(
    accountName: string,
    accountNumber: string,
    amount: number,
    fee: number,
    timeExpired: string,
    ref: string,
  ) {
    this.accountName = accountName;
    this.accountNumber = accountNumber;
    this.amount = Number(amount);
    this.fee = fee;
    this.timeExpired = timeExpired;
    this.ref = ref;
  }

  getQRPayload() {
    return {
      bankName: this.bankName,
      accountName: this.accountName,
      accountNumber: this.accountNumber,
      ref: this.ref,
      amount: this.amount,
      fee: this.fee,
      type: this.type,
      timeExpired: this.timeExpired,
    };
  }

  getJSONString() {
    return JSON.stringify({
      bankName: this.bankName,
      accountName: this.accountName,
      accountNumber: this.accountNumber,
      ref: this.ref,
      amount: this.amount,
      fee: this.fee,
      type: this.type,
      timeExpired: this.timeExpired,
    });
  }
}
