import { ACCOUNT_TYPE } from 'src/assets/paymentStatic/payment';
import {
  TransferNotified,
  NotificationResponse,
  ReceiveNotified,
} from 'src/types';
import { Notified } from './notified';
import { catchError, lastValueFrom, map } from 'rxjs';
import { NOTIFICATION_SERVICE_URL, REQUEST_CONFIG } from 'src/httpConfig';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AxiosResponse } from 'axios';

export class UserNotified extends Notified {
  constructor() {
    super();
    this.role = ACCOUNT_TYPE.USER;
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
            catchError(() => {
              throw new HttpException(
                'Notified exception',
                HttpStatus.BAD_GATEWAY,
              );
            }),
          ),
      );
      return response;
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
      response = await lastValueFrom(
        this.httpService
          .post<NotificationResponse>(
            NOTIFICATION_SERVICE_URL.receive,
            data,
            REQUEST_CONFIG,
          )
          .pipe(
            map((response: AxiosResponse) => response.data),
            catchError(() => {
              throw new HttpException(
                'Notified exception',
                HttpStatus.BAD_GATEWAY,
              );
            }),
          ),
      );
      return response;
    } catch (e) {
      console.log(e);
    } finally {
      return response;
    }
  }
}
