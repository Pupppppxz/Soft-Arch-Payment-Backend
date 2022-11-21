import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { Prisma, PrismaClient, ShopPayment, UserPayment } from '@prisma/client';
import { GenerateAccountNumber } from 'src/helpers/generateAccountNumber.helper';
import {
  ALREADY_EXIST,
  BLOCK_PAYMENT_FAIL,
  CREATE_ERROR,
  CREATE_TRANSACTION_FAIL,
  DELETE_SUCCESSFULLY,
  DEPOSIT_SUCCESSFULLY,
  DOES_NOT_HAVE_ENOUGH_MONEY,
  ERROR_DEPOSIT,
  ERROR_DEPOSIT_AMOUNT,
  ERROR_WHILE_DELETE,
  ERROR_WHILE_GET_QR_PAYLOAD,
  GET_ALLOW_PAYMENT_FAIL,
  NOT_AVAILABLE_TO_RECEIVE,
  NOT_FOUND_AMOUNT_LIMIT,
  NOT_FOUND_BALANCED,
  NOT_FOUND_USER,
  RESTORE_PAYMENT_FAIL,
  RESTORE_PAYMENT_SUCCESS,
  SUCCESS_BLOCK_PAYMENT_METHOD,
  SUCCESS_TRANSFER_TO_SAME_BANK,
  UPDATE_AMOUNT_LIMIT_COMPLETE,
  UPDATE_AMOUNT_LIMIT_ERROR,
} from 'src/assets/httpMessage/userPayment.label';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserPaymentDto } from './dto/createUserPayment.dto';
import { SetAmountLimitPerDay } from './dto/setAmountLimit.dto';
import { UserTransfer } from './dto/transfer';
import { GetQRPayload } from './dto/getQRPayload.dto';
import { GenerateTimeStamp } from 'src/helpers/generateTime.helper';
import {
  ReceiveNotified,
  TransferNotified,
  Transferred,
  UserTransactionBody,
} from 'src/types';
import { HttpService } from '@nestjs/axios';
import { forwardRef } from '@nestjs/common/utils';
import { ShopPaymentService } from 'src/shop-payment/shop-payment.service';
import {
  ACCOUNT_TYPE,
  BANK_NAME,
  TRANSFER_STATUS,
  TRANSFER_TYPE,
} from 'src/assets/paymentStatic/payment';
import { DepositDto } from './dto/depositDto.dto';
import { TRANSFER_MONEY_FAIL } from 'src/assets/httpMessage/shopPayment.label';
import { TransactionFactory } from 'src/services/transactions/transactionFactory';
import { NotifiedFactory } from 'src/services/notifieds/notifiedFactory';
import { QRPayload } from 'src/payment-gateway/entries/QRPayload.entries';
import { PaymentGatewayHelper } from 'src/helpers/paymentGateway.helper';
import { EncryptionHelper } from 'src/helpers/encryption.helper';
import { ERROR_UPDATE_IS_PAID } from 'src/assets/httpMessage/paymentGateway.label';

@Injectable()
export class UserPaymentService {
  userTransaction = TransactionFactory.getTransaction(ACCOUNT_TYPE.USER);
  userNotified = NotifiedFactory.getNotified(ACCOUNT_TYPE.USER);
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    @Inject(forwardRef(() => ShopPaymentService))
    private shopPaymentService: ShopPaymentService,
  ) {}

  async getAll() {
    const allAccounts = await this.prisma.userPayment.findMany({
      select: {
        accountID: true,
        accountNumber: true,
        balanced: true,
        isAllowPayment: true,
        amountLimit: true,
        refNumber: true,
      },
    });

    return {
      timestamp: GenerateTimeStamp.getCurrentTime(),
      statusCode: HttpStatus.OK,
      accounts: allAccounts,
    };
  }

  async deposit(depositDto: DepositDto) {
    const amount =
      depositDto.fee > 0
        ? depositDto.amount - depositDto.fee
        : depositDto.amount;

    if (amount <= 0) {
      throw new HttpException(ERROR_DEPOSIT_AMOUNT, HttpStatus.BAD_REQUEST);
    }

    const deposited = await this.prisma.userPayment.update({
      where: {
        isCorrectPaymentAccount: {
          accountID: depositDto.accountID,
          accountNumber: depositDto.accountNumber,
          isAllowPayment: true,
        },
      },
      data: {
        balanced: {
          increment: amount,
        },
      },
    });

    if (!deposited) {
      throw new HttpException(ERROR_DEPOSIT, HttpStatus.BAD_REQUEST);
    }

    return {
      timestamp: GenerateTimeStamp.getCurrentTime(),
      statusCode: HttpStatus.OK,
      message: DEPOSIT_SUCCESSFULLY,
    };
  }

  async createAccount(createUserPaymentDto: CreateUserPaymentDto) {
    let accountNumber: string = GenerateAccountNumber.GetUserAccountNumber();

    // check account exist
    const accountExist = await this.prisma.userPayment.findUnique({
      where: {
        accountID: createUserPaymentDto.accountID,
      },
    });
    if (accountExist) {
      throw new HttpException(ALREADY_EXIST, HttpStatus.BAD_REQUEST);
    }

    // check account number exist
    while (true) {
      const accountExist = await this.prisma.userPayment.findUnique({
        where: {
          accountNumber: accountNumber,
        },
      });
      if (!accountExist) {
        break;
      }
      accountNumber = GenerateAccountNumber.GetUserAccountNumber();
    }

    const userPayment: Prisma.UserPaymentCreateInput =
      await this.prisma.userPayment.create({
        data: {
          accountID: createUserPaymentDto.accountID,
          accountNumber: accountNumber,
        },
      });

    if (!userPayment) {
      throw new HttpException(CREATE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return {
      timestamp: GenerateTimeStamp.getCurrentTime(),
      statusCode: HttpStatus.CREATED,
      userPayment: {
        accountNumber: userPayment.accountNumber,
        balanced: userPayment.balanced,
        amountLimit: userPayment.amountLimit,
      },
    };
  }

  async getInformation(id: string) {
    const userPayment = await this.prisma.userPayment.findFirst({
      where: {
        accountID: id,
      },
      select: {
        accountID: true,
        accountNumber: true,
        balanced: true,
        isAllowPayment: true,
        amountLimit: true,
      },
    });
    if (!userPayment) {
      throw new HttpException(NOT_FOUND_USER, HttpStatus.BAD_REQUEST);
    }
    return {
      timestamp: GenerateTimeStamp.getCurrentTime(),
      statusCode: HttpStatus.OK,
      userPayment,
    };
  }

  async getQRPayload(qrPayload: GetQRPayload) {
    const userPayment = await this.prisma.userPayment.findUnique({
      select: {
        accountNumber: true,
        refNumber: true,
      },
      where: {
        isReadyForGetQRPayload: {
          accountID: qrPayload.accountID,
          isAllowPayment: true,
        },
      },
    });

    if (!userPayment) {
      throw new HttpException(
        ERROR_WHILE_GET_QR_PAYLOAD,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const timeExpired = await PaymentGatewayHelper.getExpiredTime(10000);

    const QRPayloadObj = new QRPayload(
      qrPayload.name,
      userPayment.accountNumber,
      0,
      qrPayload.fee,
      timeExpired,
      '',
    );

    const encrypted = await EncryptionHelper.encryptQRPayload(QRPayloadObj);

    return {
      timestamp: GenerateTimeStamp.getCurrentTime(),
      statusCode: HttpStatus.OK,
      QRPayload: encrypted,
    };
  }

  async getUserBalanced(id: string) {
    const userPayment = await this.prisma.userPayment.findFirst({
      where: {
        accountID: id,
      },
      select: {
        balanced: true,
      },
    });
    if (!userPayment) {
      throw new HttpException(NOT_FOUND_BALANCED, HttpStatus.BAD_REQUEST);
    }
    return {
      timestamp: GenerateTimeStamp.getCurrentTime(),
      statusCode: HttpStatus.OK,
      balanced: userPayment.balanced,
    };
  }

  async getAmountLimitPerDay(id: string) {
    const userPayment = await this.prisma.userPayment.findFirst({
      where: {
        accountID: id,
      },
      select: {
        amountLimit: true,
      },
    });
    if (!userPayment) {
      throw new HttpException(NOT_FOUND_AMOUNT_LIMIT, HttpStatus.BAD_REQUEST);
    }
    return {
      timestamp: GenerateTimeStamp.getCurrentTime(),
      statusCode: HttpStatus.OK,
      amountLimit: userPayment.amountLimit,
    };
  }

  async setAmountLimitPerDay(amountLimit: SetAmountLimitPerDay) {
    const userPayment = await this.prisma.userPayment.update({
      where: {
        accountID: amountLimit.id,
      },
      data: {
        amountLimit: +amountLimit.amount,
      },
    });
    if (!userPayment) {
      throw new HttpException(
        UPDATE_AMOUNT_LIMIT_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      timestamp: GenerateTimeStamp.getCurrentTime(),
      statusCode: HttpStatus.OK,
      message: UPDATE_AMOUNT_LIMIT_COMPLETE,
    };
  }

  async blockPayment(id: string) {
    const isFinish = await this.prisma.userPayment.update({
      where: {
        accountID: id,
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
    const isFinish = await this.prisma.userPayment.update({
      where: {
        accountID: id,
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
    const isAllow = await this.prisma.userPayment.findFirst({
      where: {
        accountID: id,
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

  async DBTransactionTransferToUser(transfer: UserTransfer, date: Date) {
    return await this.prisma.$transaction(async (tx: PrismaClient) => {
      const userType = GenerateAccountNumber.CheckIsDestinationType(
        transfer.otherAccountNumber,
      );
      let recipient = null;
      const transferred: Transferred = {
        id: '',
        balance: 0,
      };

      const sender = await tx.userPayment.update({
        data: {
          balanced: {
            decrement: +transfer.amount,
          },
        },
        where: {
          readyForPayment: {
            accountNumber: transfer.userAccountNumber,
            isAllowPayment: true,
          },
        },
      });

      if (sender.balanced < 0) {
        throw new HttpException(
          DOES_NOT_HAVE_ENOUGH_MONEY,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (userType === ACCOUNT_TYPE.USER) {
        recipient = (await tx.userPayment.update({
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
        })) as UserPayment;

        transferred.id = recipient.accountID;
        transferred.balance = recipient.balanced;
      } else if (userType === ACCOUNT_TYPE.SHOP) {
        recipient = (await tx.shopPayment.update({
          data: {
            balanced: {
              increment: transfer.amount,
            },
          },
          where: {
            isShopReadyForPayment: {
              accountNumber: transfer.otherAccountNumber,
              isAllowPayment: true,
            },
          },
        })) as ShopPayment;

        const updatedQR = await tx.qRShopPayment.update({
          where: {
            QRRef: transfer.ref,
          },
          data: {
            isPaid: true,
          },
        });

        if (!updatedQR && transfer.ref !== '') {
          throw new HttpException(
            ERROR_UPDATE_IS_PAID,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        transferred.id = recipient.shopID;
        transferred.balance = recipient.balanced;
      }

      if (!recipient) {
        throw new HttpException(NOT_AVAILABLE_TO_RECEIVE, HttpStatus.CONFLICT);
      }

      const transferTransactionObj: UserTransactionBody = {
        accountID: sender.accountID,
        IPAddress: transfer.IPAddress,
        userAccountNumber: transfer.userAccountNumber,
        otherAccountNumber: transfer.otherAccountNumber,
        nameOther: transfer.nameOther,
        bankNameOther: transfer.bankNameOther,
        amount: transfer.amount,
        fee: transfer.fee,
        type: TRANSFER_TYPE.TRANSFER,
        date: date.toISOString(),
        balance: sender.balanced,
      };

      const receivedTransactionObj: UserTransactionBody = {
        accountID: transferred.id,
        IPAddress: transfer.IPAddress,
        userAccountNumber: transfer.otherAccountNumber,
        otherAccountNumber: transfer.userAccountNumber,
        nameOther: transfer.userAccountName,
        bankNameOther: BANK_NAME.FOUR_QU,
        amount: transfer.amount,
        fee: transfer.amount,
        type: TRANSFER_TYPE.RECEIVE,
        date: date.toISOString(),
        balance: transferred.balance,
      };

      const transaction = await Promise.all([
        this.userTransaction.createTransaction(transferTransactionObj),
        userType === ACCOUNT_TYPE.USER
          ? this.userTransaction.createTransaction(receivedTransactionObj)
          : this.shopPaymentService.shopTransaction.createTransaction(
              receivedTransactionObj,
            ),
      ]);

      if (!transaction) {
        throw new HttpException(
          CREATE_TRANSACTION_FAIL,
          HttpStatus.BAD_GATEWAY,
        );
      }

      return { sender, transaction, transferred, userType };
    });
  }

  async transferToSameBank(transfer: UserTransfer) {
    const date = new Date();

    const transferred = await this.DBTransactionTransferToUser(transfer, date);

    if (!transferred) {
      throw new HttpException(
        TRANSFER_MONEY_FAIL,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const userNotifiedObj: TransferNotified = {
      date: date.toISOString(),
      sourceAccountNumber: transfer.userAccountNumber,
      destBank: transfer.bankNameOther,
      destAccountNumber: transfer.otherAccountNumber,
      destAccountName: transfer.nameOther,
      paymentStatus: TRANSFER_STATUS.FINISH,
      sourcePhoneNumber: transfer.sourcePhone,
      amount: transfer.amount,
      fee: transfer.fee,
      availableBalance: transferred.sender.balanced,
      transactionNumber: transferred.transaction[0].transactionID,
      destEmail: transfer.sourceEmail,
    };

    const receiveNotified: ReceiveNotified = {
      date: date.toISOString(),
      sourceName: transfer.userAccountNumber,
      sourceAccountNumber: transfer.userAccountNumber,
      sourceBankName: BANK_NAME.FOUR_QU,
      status: TRANSFER_STATUS.FINISH,
      destAccountNumber: transfer.otherAccountNumber,
      destAccountName: transfer.nameOther,
      amount: transfer.amount,
      fee: transfer.fee,
      availableBalance: transferred.transferred.balance,
      destEmail: transfer.destEmail,
      destPhoneNumber: transfer.destPhone,
    };

    await Promise.all([
      this.userNotified.transferNotified(userNotifiedObj),
      transferred.userType === ACCOUNT_TYPE.USER
        ? this.userNotified.receiveNotified(receiveNotified)
        : this.shopPaymentService.shopNotified.receiveNotified(receiveNotified),
    ]);

    return {
      timestamp: GenerateTimeStamp.getCurrentTime(),
      statusCode: HttpStatus.OK,
      message: SUCCESS_TRANSFER_TO_SAME_BANK,
    };
  }

  // async transferToOtherBank(id: string, otherBank: TransferToOtherBank) {}

  async deletePayment(id: string) {
    const paymentDeleted = await this.prisma.userPayment.update({
      where: {
        accountID: id,
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
    const paymentDeleted = await this.prisma.userPayment.update({
      where: {
        accountID: id,
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
