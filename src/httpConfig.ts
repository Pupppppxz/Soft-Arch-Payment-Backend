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
  shop: 'https://6739-2001-44c8-4082-bcdc-5131-9b10-6f9-ba99.ap.ngrok.io/payment-gateway',
  user: 'https://6739-2001-44c8-4082-bcdc-5131-9b10-6f9-ba99.ap.ngrok.io/payment-transaction',
};

export const QR_SERVICE_URL = 'https://f238-223-24-186-108.ap.ngrok.io/api/qr';
export const QR_ORIGIN = 'https://f238-223-24-186-108.ap.ngrok.io/';
