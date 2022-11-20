import { HttpService } from '@nestjs/axios';
import {
  ShopTransactionBody,
  UserTransactionBody,
  TransactionResponse,
} from 'src/types';
import { TransactionInterface } from './transactionInterface';

export class Transaction implements TransactionInterface {
  httpService: HttpService = new HttpService();
  role: string;
  async createTransaction(
    payload: ShopTransactionBody | UserTransactionBody,
  ): Promise<TransactionResponse> {
    return { message: '', transactionID: '' };
  }
}
