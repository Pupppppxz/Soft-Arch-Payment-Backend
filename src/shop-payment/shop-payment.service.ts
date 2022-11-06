import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  CREATE_SHOP_FAIL,
  GET_BALANCED_FAIL,
  NOT_FOUND_SHOP,
  SHOP_ALREADY_EXIST,
  UPDATE_AMOUNT_LIMIT_FAIL,
  UPDATE_AMOUNT_LIMIT_FINISH,
} from 'src/assets/httpMessage/shopPayment.label';
import { GenerateAccountNumber } from 'src/helpers/generateAccountNumber.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateShopPaymentDto } from './dto/createShopPayment.dto';
import { Prisma, PrismaClient } from '@prisma/client';
import { SetShopAmountLimitPerDayDTO } from './dto/setShopAmountLimitPerDay.dto';
import {
  BLOCK_PAYMENT_FAIL,
  DELETE_SUCCESSFULLY,
  DOES_NOT_HAVE_ENOUGH_MONEY,
  ERROR_WHILE_DELETE,
  GET_ALLOW_PAYMENT_FAIL,
  NOT_AVAILABLE_TO_RECEIVE,
  RESTORE_PAYMENT_FAIL,
  RESTORE_PAYMENT_SUCCESS,
  SUCCESS_BLOCK_PAYMENT_METHOD,
  SUCCESS_TRANSFER_TO_SAME_BANK,
} from 'src/assets/httpMessage/userPayment.label';
import { ShopTransfer } from './dto/shopTransfer.dto';
import { GenerateTimeStamp } from 'src/helpers/generateTime.helper';

@Injectable()
export class ShopPaymentService {
  constructor(private prisma: PrismaService) {}

  async createAccount(createShopPaymentDto: CreateShopPaymentDto) {
    let accountNumber: string = GenerateAccountNumber.GetShopAccountNumber();

    const accountExist = await this.prisma.shopPayment.findUnique({
      where: {
        shopID: createShopPaymentDto.shopID,
      },
    });

    if (accountExist) {
      throw new HttpException(SHOP_ALREADY_EXIST, HttpStatus.BAD_REQUEST);
    }

    while (true) {
      const accountExist = await this.prisma.shopPayment.findUnique({
        where: {
          accountNumber: accountNumber,
        },
      });
      if (!accountExist) {
        break;
      }
      accountNumber = GenerateAccountNumber.GetShopAccountNumber();
    }

    const shopPayment: Prisma.ShopPaymentCreateInput =
      await this.prisma.shopPayment.create({
        data: {
          accountNumber: accountNumber,
          shopID: createShopPaymentDto.shopID,
        },
      });

    if (!shopPayment) {
      throw new HttpException(
        CREATE_SHOP_FAIL,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      timestamp: GenerateTimeStamp.getCurrentTime(),
      statusCode: HttpStatus.CREATED,
      shopPayment: {
        accountNumber: shopPayment.accountNumber,
        balanced: shopPayment.balanced,
        amountLimit: shopPayment.amountLimit,
      },
    };
  }

  async getInformation(id: string) {
    const shopPayment = await this.prisma.shopPayment.findFirst({
      where: {
        shopID: id,
      },
      select: {
        shopID: true,
        accountNumber: true,
        balanced: true,
        isAllowPayment: true,
        amountLimit: true,
      },
    });
    if (!shopPayment) {
      throw new HttpException(NOT_FOUND_SHOP, HttpStatus.BAD_REQUEST);
    }
    return {
      timestamp: new Date().toUTCString(),
      statusCode: HttpStatus.OK,
      shopPayment,
    };
  }

  async getAccountBalanced(id: string) {
    const balanced = await this.prisma.shopPayment.findFirst({
      where: {
        shopID: id,
      },
      select: {
        balanced: true,
      },
    });

    if (!balanced) {
      throw new HttpException(GET_BALANCED_FAIL, HttpStatus.BAD_REQUEST);
    }

    return {
      timestamp: GenerateTimeStamp.getCurrentTime(),
      statusCode: HttpStatus.OK,
      ...balanced,
    };
  }

  async getAmountLimitPerDay(id: string) {
    const amountLimit = await this.prisma.shopPayment.findFirst({
      where: {
        shopID: id,
      },
      select: {
        amountLimit: true,
      },
    });

    if (!amountLimit) {
      throw new HttpException(GET_BALANCED_FAIL, HttpStatus.BAD_REQUEST);
    }

    return {
      timestamp: GenerateTimeStamp.getCurrentTime(),
      statusCode: HttpStatus.OK,
      ...amountLimit,
    };
  }

  async setAmountLimitPerDay(amount: SetShopAmountLimitPerDayDTO) {
    const isFinish = await this.prisma.shopPayment.update({
      where: {
        shopID: amount.shopID,
      },
      data: {
        amountLimit: amount.amount,
      },
    });

    if (!isFinish) {
      throw new HttpException(UPDATE_AMOUNT_LIMIT_FAIL, HttpStatus.BAD_REQUEST);
    }

    return {
      timestamp: GenerateTimeStamp.getCurrentTime(),
      statusCode: HttpStatus.OK,
      message: UPDATE_AMOUNT_LIMIT_FINISH,
    };
  }

  async blockPayment(id: string) {
    const isFinish = await this.prisma.shopPayment.update({
      where: {
        shopID: id,
      },
      data: {
        isAllowPayment: false,
      },
    });
    if (!isFinish) {
      throw new HttpException(
        BLOCK_PAYMENT_FAIL,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      timestamp: GenerateTimeStamp.getCurrentTime(),
      statusCode: HttpStatus.OK,
      message: SUCCESS_BLOCK_PAYMENT_METHOD,
    };
  }

  async unBlockPayment(id: string) {
    const isFinish = await this.prisma.shopPayment.update({
      where: {
        shopID: id,
      },
      data: {
        isAllowPayment: true,
      },
    });
    if (!isFinish) {
      throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return {
      timestamp: GenerateTimeStamp.getCurrentTime(),
      statusCode: HttpStatus.OK,
      message: SUCCESS_BLOCK_PAYMENT_METHOD,
    };
  }

  async getIsAccountAllowPayment(id: string) {
    const isAllow = await this.prisma.shopPayment.findFirst({
      where: {
        shopID: id,
      },
      select: {
        isAllowPayment: true,
      },
    });

    if (!isAllow) {
      throw new HttpException(
        GET_ALLOW_PAYMENT_FAIL,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      timestamp: GenerateTimeStamp.getCurrentTime(),
      statusCode: HttpStatus.OK,
      ...isAllow,
    };
  }

  async DBTransactionTransfer(from: string, to: string, amount: number) {
    return await this.prisma.$transaction(async (tx: PrismaClient) => {
      const sender = await tx.shopPayment.update({
        data: {
          balanced: {
            decrement: amount,
          },
        },
        where: {
          isShopReadyForPayment: {
            isAllowPayment: true,
            accountNumber: from,
          },
        },
      });

      if (sender.balanced < 0) {
        throw new HttpException(
          DOES_NOT_HAVE_ENOUGH_MONEY,
          HttpStatus.BAD_REQUEST,
        );
      }

      const recipient = await tx.userPayment.update({
        data: {
          balanced: {
            increment: amount,
          },
        },
        where: {
          readyForPayment: {
            accountNumber: to,
            isAllowPayment: true,
          },
        },
      });

      if (!recipient) {
        throw new HttpException(NOT_AVAILABLE_TO_RECEIVE, HttpStatus.CONFLICT);
      }

      return sender;
    });
  }

  async transferToSameBank(transfer: ShopTransfer) {
    const sender = await this.DBTransactionTransfer(
      transfer.shopAccountNumber,
      transfer.otherAccountNumber,
      transfer.amount,
    );

    console.log('====================================');
    console.log(sender);
    console.log('====================================');

    return {
      timestamp: GenerateTimeStamp.getCurrentTime(),
      statusCode: HttpStatus.OK,
      message: SUCCESS_TRANSFER_TO_SAME_BANK,
    };
  }

  async deletePayment(id: string) {
    const paymentDeleted = await this.prisma.shopPayment.update({
      where: {
        shopID: id,
      },
      data: {
        deleted_at: new Date().toUTCString(),
      },
    });
    if (!paymentDeleted) {
      throw new HttpException(
        ERROR_WHILE_DELETE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      timestamp: GenerateTimeStamp.getCurrentTime(),
      statusCode: HttpStatus.OK,
      message: DELETE_SUCCESSFULLY,
    };
  }

  async restorePayment(id: string) {
    const paymentDeleted = await this.prisma.shopPayment.update({
      where: {
        shopID: id,
      },
      data: {
        deleted_at: null,
      },
    });
    if (!paymentDeleted) {
      throw new HttpException(
        RESTORE_PAYMENT_FAIL,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      timestamp: GenerateTimeStamp.getCurrentTime(),
      statusCode: HttpStatus.OK,
      message: RESTORE_PAYMENT_SUCCESS,
    };
  }
}
