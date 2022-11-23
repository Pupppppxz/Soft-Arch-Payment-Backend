import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  GET_QR_URL_FAIL,
  NOT_FOUND_QR,
  CREATE_QR_FAIL,
  UPDATE_QR_STATUS_FAIL,
  DELETED_QR_FAIL,
  FINISHED_UPDATE_QR_STATUS,
  FINISHED_DELETED_QR,
  NOT_FOUND_QR_IMAGE,
  ERROR_CALLBACK,
} from 'src/assets/httpMessage/paymentGateway.label';
import { FEE } from 'src/assets/paymentStatic/payment';
import { EncryptionHelper } from 'src/helpers/encryption.helper';
import { GenerateTimeStamp } from 'src/helpers/generateTime.helper';
import { PaymentGatewayHelper } from 'src/helpers/paymentGateway.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { GenerateQRDto } from './dto/generateQR.dto';
import { QRPayload } from './entries/QRPayload.entries';
import { HttpService } from '@nestjs/axios/dist';
import { catchError, lastValueFrom, map, tap } from 'rxjs';
import { AxiosResponse } from 'axios';
import { GenerateQRResponse, RemoveQRResponse } from './types';
import { QRDto } from './dto/QR.dto';
import { PAYMENT_NOT_ALLOW } from 'src/assets/httpMessage/shopPayment.label';
import { CallbackResponse } from 'src/types';
import { QR_ORIGIN, QR_SERVICE_URL, REQUEST_CONFIG } from 'src/httpConfig';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PaymentGatewayService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  async getQRUrl(payload: string): Promise<GenerateQRResponse> {
    const data = { payload };

    return lastValueFrom(
      this.httpService
        .post<GenerateQRResponse>(QR_SERVICE_URL, data, REQUEST_CONFIG)
        .pipe(
          map((response: AxiosResponse) => response.data),
          tap((resp) => console.log(resp.data)),
          catchError(() => {
            throw new HttpException(CREATE_QR_FAIL, HttpStatus.BAD_REQUEST);
          }),
        ),
    );
  }

  async removeQRPicture(qrName: string): Promise<RemoveQRResponse> {
    const data = { qrName };

    return lastValueFrom(
      this.httpService
        .delete<GenerateQRResponse>(QR_SERVICE_URL, { data })
        .pipe(
          map((response: AxiosResponse) => response.data),
          tap((resp) => console.log(resp.data)),
          catchError(() => {
            throw new HttpException(CREATE_QR_FAIL, HttpStatus.BAD_REQUEST);
          }),
        ),
    );
  }

  async executeCallbackURL(url: string): Promise<CallbackResponse> {
    return lastValueFrom(
      this.httpService.post<CallbackResponse>(url).pipe(
        map((response: AxiosResponse) => response.status),
        tap(console.log),
        catchError(() => {
          throw new HttpException(ERROR_CALLBACK, HttpStatus.BAD_REQUEST);
        }),
      ),
    );
  }

  async qrTransaction(qrBody: GenerateQRDto) {
    return await this.prisma.$transaction(async (tx: PrismaClient) => {
      const timeExpired = await PaymentGatewayHelper.getExpiredTime(
        qrBody.timeAmount,
      );

      const qrObject = await tx.qRShopPayment.create({
        data: {
          accountNumber: qrBody.accountNumber,
          expiredTime: new Date(timeExpired),
          amount: +qrBody.amount,
          qrURL: '',
        },
      });

      if (!qrObject) {
        throw new HttpException(CREATE_QR_FAIL, HttpStatus.BAD_REQUEST);
      }

      const qrPayload = new QRPayload(
        qrBody.accountName,
        qrBody.accountNumber,
        qrBody.amount,
        FEE,
        timeExpired,
        qrObject.QRRef,
      );

      const encrypted = await EncryptionHelper.encryptQRPayload(qrPayload);

      const response = await this.getQRUrl(encrypted);

      if (response.data === '' || !response.data) {
        throw new HttpException(CREATE_QR_FAIL, HttpStatus.BAD_REQUEST);
      }

      const updated = await tx.qRShopPayment.update({
        data: {
          qrURL: response.data,
        },
        where: {
          QRRef: qrObject.QRRef,
        },
      });

      if (!updated) {
        throw new HttpException(CREATE_QR_FAIL, HttpStatus.BAD_REQUEST);
      }

      return { ...updated };
    });
  }

  async generateQRPayment(qrBody: GenerateQRDto) {
    const shopPayment = await this.prisma.shopPayment.findFirst({
      where: {
        accountNumber: qrBody.accountNumber,
      },
      select: {
        isAllowPayment: true,
      },
    });

    if (!shopPayment?.isAllowPayment) {
      throw new HttpException(PAYMENT_NOT_ALLOW, HttpStatus.BAD_REQUEST);
    }

    const qrObject = await this.qrTransaction(qrBody);

    return {
      timestamp: GenerateTimeStamp.getCurrentTime(),
      statusCode: HttpStatus.OK,
      QR: PaymentGatewayHelper.reformatResponseQR(qrObject),
    };
  }

  async checkIsUserPaid(payload: QRDto) {
    const qrObj = await this.prisma.qRShopPayment.findFirst({
      where: {
        accountNumber: payload.accountNumber,
        QRRef: payload.QRRef,
      },
      select: {
        isPaid: true,
      },
    });

    if (!qrObj) {
      throw new HttpException(NOT_FOUND_QR, HttpStatus.BAD_REQUEST);
    }

    return {
      timestamp: GenerateTimeStamp.getCurrentTime(),
      statusCode: HttpStatus.OK,
      isPaid: qrObj.isPaid,
    };
  }

  async getQRCodeURL(payload: QRDto) {
    const qrObj = await this.prisma.qRShopPayment.findFirst({
      where: {
        accountNumber: payload.accountNumber,
        QRRef: payload.QRRef,
      },
      select: {
        qrURL: true,
        expiredTime: true,
      },
    });

    if (!qrObj) {
      throw new HttpException(GET_QR_URL_FAIL, HttpStatus.BAD_REQUEST);
    }

    return {
      timestamp: GenerateTimeStamp.getCurrentTime(),
      statusCode: HttpStatus.OK,
      QR: QR_ORIGIN + qrObj,
    };
  }

  async updateQRToFinish(payload: QRDto) {
    const updated = await this.prisma.qRShopPayment.update({
      where: {
        isValidShopQR: {
          accountNumber: payload.accountNumber,
          QRRef: payload.QRRef,
        },
      },
      data: {
        isPaid: true,
      },
    });

    if (!updated) {
      throw new HttpException(
        UPDATE_QR_STATUS_FAIL,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      timestamp: GenerateTimeStamp.getCurrentTime(),
      statusCode: HttpStatus.OK,
      message: FINISHED_UPDATE_QR_STATUS,
    };
  }

  async removeQR(payload: QRDto) {
    const deleted = await this.prisma.qRShopPayment.delete({
      where: {
        isValidShopQR: {
          accountNumber: payload.accountNumber,
          QRRef: payload.QRRef,
        },
      },
    });

    if (!deleted) {
      throw new HttpException(DELETED_QR_FAIL, HttpStatus.BAD_REQUEST);
    }

    const response = await this.removeQRPicture(deleted.qrURL.split('/')[1]);

    if (response.message !== 'Removed!') {
      throw new HttpException(NOT_FOUND_QR_IMAGE, HttpStatus.BAD_REQUEST);
    }

    return {
      timestamp: GenerateTimeStamp.getCurrentTime(),
      statusCode: HttpStatus.OK,
      message: FINISHED_DELETED_QR,
    };
  }
}
