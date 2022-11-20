import { HttpService } from '@nestjs/axios';
import {
  ShopTransactionBody,
  TransactionResponse,
  UserTransactionBody,
} from 'src/types';

export interface TransactionInterface {
  httpService: HttpService;
  role: string;
  createTransaction(
    payload: UserTransactionBody | ShopTransactionBody,
  ): Promise<TransactionResponse>;
}
