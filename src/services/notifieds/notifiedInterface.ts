import { HttpService } from '@nestjs/axios';
import {
  NotificationResponse,
  ReceiveNotified,
  TransferNotified,
} from 'src/types';

export interface NotifiedInterface {
  role: string;
  httpService: HttpService;
  transferNotified(notified: TransferNotified): Promise<NotificationResponse>;
  receiveNotified(notified: ReceiveNotified): Promise<NotificationResponse>;
}
