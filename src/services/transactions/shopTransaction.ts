import { HttpException, HttpStatus } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { map, tap, catchError, lastValueFrom } from 'rxjs';
import { ACCOUNT_TYPE } from 'src/assets/paymentStatic/payment';
import { REQUEST_CONFIG, TRANSACTION_SERVICE_URL } from 'src/httpConfig';
import {
  ShopTransactionBody,
  UserTransactionBody,
  TransactionResponse,
} from 'src/types';
import { Transaction } from './transaction';

export class ShopTransaction extends Transaction {
  constructor() {
    super();
    this.role = ACCOUNT_TYPE.SHOP;
  }

  async createTransaction(
    payload: ShopTransactionBody | UserTransactionBody,
  ): Promise<TransactionResponse> {
    return lastValueFrom(
      this.httpService
        .post<TransactionResponse>(
          TRANSACTION_SERVICE_URL.shop,
          { ...payload },
          REQUEST_CONFIG,
        )
        .pipe(
          map((response: AxiosResponse) => response.data),
          tap(console.log),
          catchError((e) => {
            console.log(e);
            throw new HttpException(
              'Transaction exception',
              HttpStatus.BAD_GATEWAY,
            );
          }),
        ),
    );
  }
}
