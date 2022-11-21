import { AxiosRequestConfig } from 'axios';

export const REQUEST_CONFIG: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const NOTIFICATION_SERVICE_URL = {
  transfer:
    'https://quplus-noti-service.herokuapp.com/email-notification/payment',
  receive:
    'https://quplus-noti-service.herokuapp.com/email-notification/payment-rc',
};

export const TRANSACTION_SERVICE_URL = {
  shop: 'http://localhost:3001/payment-gateway',
  user: 'http://localhost:3001/payment-transaction',
};
