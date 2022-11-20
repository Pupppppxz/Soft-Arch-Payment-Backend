import { HttpService } from '@nestjs/axios';
import {
  NotificationResponse,
  ReceiveNotified,
  TransferNotified,
} from 'src/types';
import { NotifiedInterface } from './notifiedInterface';

export class Notified implements NotifiedInterface {
  httpService: HttpService = new HttpService();
  role: string;

  async transferNotified(
    notified: TransferNotified,
  ): Promise<NotificationResponse> {
    return { message: '' };
  }

  async receiveNotified(
    notified: ReceiveNotified,
  ): Promise<NotificationResponse> {
    return { message: '' };
  }
}
