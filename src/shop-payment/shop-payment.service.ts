import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import {
  CREATE_SHOP_FAIL,
  ERROR_GET_ALL_SHOP,
  GET_BALANCED_FAIL,
  NOT_FOUND_SHOP,
  SHOP_ALREADY_EXIST,
  TRANSFER_MONEY_FAIL,
  TRANSFER_NOT_ACCEPT,
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
  CREATE_TRANSACTION_FAIL,
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
import { HttpService } from '@nestjs/axios/dist';
import { ShopTransactionBody, UserTransactionBody } from 'src/types';
import { ShopNotifiedHelper } from 'src/helpers/shopNotified.helper';
import { UserNotified } from 'src/helpers/userNotified.helper';
import { forwardRef } from '@nestjs/common/utils';
import { UserPaymentService } from 'src/user-payment/user-payment.service';
import {
  ACCOUNT_TYPE,
  BANK_NAME,
  TRANSFER_STATUS,
  TRANSFER_TYPE,
} from 'src/assets/paymentStatic/payment';
import { TransactionFactory } from 'src/services/transactions/transactionFactory';
import { NotifiedFactory } from 'src/services/notifieds/notifiedFactory';

@Injectable()
export class ShopPaymentService {
  shopTransaction = TransactionFactory.getTransaction(ACCOUNT_TYPE.SHOP);
  shopNotified = NotifiedFactory.getNotified(ACCOUNT_TYPE.SHOP);
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    @Inject(forwardRef(() => UserPaymentService))
    private userPaymentService: UserPaymentService,
  ) {}

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
          callbackURL: createShopPaymentDto.callbackURL as string,
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

  async getAllShops() {
    const allShops = await this.prisma.shopPayment.findMany({
      where: {
        deleted_at: null,
      },
      select: {
        shopID: true,
        accountNumber: true,
        balanced: true,
        isAllowPayment: true,
        amountLimit: true,
      },
    });

    if (!allShops) {
      throw new HttpException(ERROR_GET_ALL_SHOP, HttpStatus.BAD_REQUEST);
    }

    return {
      timestamp: new Date().toUTCString(),
      statusCode: HttpStatus.OK,
      allShops: allShops,
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
        deleted_at: null,
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
        deleted_at: null,
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
        amountLimit: +amount.amount,
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
        deleted_at: null,
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

  async DBTransactionTransfer(transfer: ShopTransfer, date: Date) {
    return await this.prisma.$transaction(async (tx: PrismaClient) => {
      const sender = await tx.shopPayment.update({
        data: {
          balanced: {
            decrement: +transfer.amount,
          },
        },
        where: {
          isShopReadyForPayment: {
            isAllowPayment: true,
            accountNumber: transfer.shopAccountNumber,
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
            increment: +transfer.amount,
          },
        },
        where: {
          readyForPayment: {
            accountNumber: transfer.otherAccountNumber,
            isAllowPayment: true,
          },
        },
      });

      if (!recipient) {
        throw new HttpException(NOT_AVAILABLE_TO_RECEIVE, HttpStatus.CONFLICT);
      }

      const transferTransactionObj: ShopTransactionBody = {
        shopID: sender.shopID,
        shopAccountNumber: transfer.shopAccountNumber,
        userAccountNumber: transfer.otherAccountNumber,
        nameUser: transfer.nameOther,
        bankNameUser: transfer.bankNameOther,
        amount: transfer.amount,
        balance: sender.balanced,
        fee: transfer.fee,
        type: TRANSFER_TYPE.TRANSFER,
        isFinish: true,
        date: date.toISOString(),
      };

      const receivedTransactionObj: UserTransactionBody = {
        accountID: recipient.accountID,
        IPAddress: transfer.IPAddress,
        userAccountNumber: transfer.otherAccountNumber,
        otherAccountNumber: transfer.shopAccountNumber,
        nameOther: transfer.shopName,
        bankNameOther: BANK_NAME.FOUR_QU,
        amount: transfer.amount,
        balance: recipient.balanced,
        fee: transfer.fee,
        type: TRANSFER_TYPE.RECEIVE,
        date: date.toISOString(),
      };

      const transaction = await Promise.all([
        this.shopTransaction.createTransaction(transferTransactionObj),
        this.userPaymentService.userTransaction.createTransaction(
          receivedTransactionObj,
        ),
      ]);

      if (!transaction) {
        throw new HttpException(
          CREATE_TRANSACTION_FAIL,
          HttpStatus.BAD_GATEWAY,
        );
      }

      return { sender, transaction, recipient };
    });
  }

  async transferToSameBank(transfer: ShopTransfer) {
    const date = new Date();
    const userType = GenerateAccountNumber.CheckIsDestinationType(
      transfer.otherAccountNumber,
    );

    if (userType === ACCOUNT_TYPE.SHOP) {
      throw new HttpException(TRANSFER_NOT_ACCEPT, HttpStatus.BAD_REQUEST);
    }

    const transferred = await this.DBTransactionTransfer(transfer, date);

    if (!transferred) {
      throw new HttpException(
        TRANSFER_MONEY_FAIL,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const shopNotifiedObj = ShopNotifiedHelper.formatTransferNotified(
      transferred.sender,
      transfer,
      transferred.transaction[0].transactionID,
      TRANSFER_STATUS.FINISH,
      new Date().toISOString(),
      transfer.phone,
    );

    const userReceive = UserNotified.formatUserReceive(
      transferred.recipient.balanced,
      transfer,
      transferred.sender,
      new Date().toISOString(),
      TRANSFER_STATUS.FINISH,
    );

    await Promise.all([
      this.shopNotified.transferNotified(shopNotifiedObj),
      this.userPaymentService.userNotified.receiveNotified(userReceive),
    ]);

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
        deleted_at: new Date().toISOString(),
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
