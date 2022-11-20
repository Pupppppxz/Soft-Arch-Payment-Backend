import { ACCOUNT_TYPE } from 'src/assets/paymentStatic/payment';
import {
  ShopTransactionBody,
  UserTransactionBody,
  TransactionResponse,
} from 'src/types';
import { Transaction } from './transaction';
import { catchError, lastValueFrom, map, tap } from 'rxjs';
import { TRANSACTION_SERVICE_URL } from 'src/httpConfig';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { REQUEST_CONFIG } from './../../httpConfig';

export class UserTransaction extends Transaction {
  constructor() {
    super();
    this.role = ACCOUNT_TYPE.USER;
  }

  async createTransaction(
    payload: ShopTransactionBody | UserTransactionBody,
  ): Promise<TransactionResponse> {
    return lastValueFrom(
      this.httpService
        .post<TransactionResponse>(
          TRANSACTION_SERVICE_URL.user,
          {
            ...payload,
          },
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
