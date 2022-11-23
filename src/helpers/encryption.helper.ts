import * as CryptoJS from 'crypto-js';
import { QRPayload } from 'src/payment-gateway/entries/QRPayload.entries';

export class EncryptionHelper {
  static ALGORITHM = 'aes-256-cbc';
  static IV_KEY = CryptoJS.enc.Utf8.parse(process.env.IV_KEY as string);
  static KEY = CryptoJS.enc.Utf8.parse(
    process.env.ENCRYPTION_KEY || 'very secure key 555',
  );
  static KEY_SIZE = 128 / 8;

  static async encryptQRPayload(payload: QRPayload) {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(payload.getQRPayload()),
      this.KEY,
      {
        keySize: this.KEY_SIZE,
        iv: this.IV_KEY,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      },
    );
    return encrypted.toString();
  }

  static async decryption(hexString: string) {
    const decrypted = CryptoJS.AES.decrypt(hexString, this.KEY, {
      keySize: this.KEY_SIZE,
      iv: this.IV_KEY,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);
    return decrypted;
  }
}
