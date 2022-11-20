import { HttpException, HttpStatus } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { catchError, lastValueFrom, map, tap } from 'rxjs';
import { ACCOUNT_TYPE } from 'src/assets/paymentStatic/payment';
import { NOTIFICATION_SERVICE_URL, REQUEST_CONFIG } from 'src/httpConfig';
import {
  TransferNotified,
  NotificationResponse,
  ReceiveNotified,
} from 'src/types';
import { Notified } from './notified';

export class ShopNotified extends Notified {
  constructor() {
    super();
    this.role = ACCOUNT_TYPE.SHOP;
  }

  async transferNotified(
    notified: TransferNotified,
  ): Promise<NotificationResponse> {
    const data = { ...notified };
    let response;
    try {
      response = await lastValueFrom(
        this.httpService
          .post<NotificationResponse>(
            NOTIFICATION_SERVICE_URL.transfer,
            data,
            REQUEST_CONFIG,
          )
          .pipe(
            map((response: AxiosResponse) => response.data),
            catchError((e) => {
              console.log(e);
              throw new HttpException(
                'Notified exception',
                HttpStatus.BAD_GATEWAY,
              );
            }),
          ),
      );
    } catch (e) {
      console.log(e);
    } finally {
      return response;
    }
  }

  async receiveNotified(
    notified: ReceiveNotified,
  ): Promise<NotificationResponse> {
    const data = { ...notified };
    let response;
    try {
      response = lastValueFrom(
        this.httpService
          .post<NotificationResponse>(
            NOTIFICATION_SERVICE_URL.receive,
            data,
            REQUEST_CONFIG,
          )
          .pipe(
            map((response: AxiosResponse) => response.data),
            catchError((e) => {
              console.log(e);
              throw new HttpException(
                'Notified exception',
                HttpStatus.BAD_GATEWAY,
              );
            }),
          ),
      );
    } catch (e) {
      console.log(e);
    } finally {
      return response;
    }
  }
}
