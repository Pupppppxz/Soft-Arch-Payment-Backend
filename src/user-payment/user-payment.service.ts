import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { GenerateAccountNumber } from 'src/helpers/generateAccountNumber.helper';
import {
  ALREADY_EXIST,
  BLOCK_PAYMENT_FAIL,
  CREATE_ERROR,
  DELETE_SUCCESSFULLY,
  DOES_NOT_HAVE_ENOUGH_MONEY,
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
import { Transfer } from './dto/transfer';
import { GetQRPayload } from './dto/getQRPayload.dto';
import { GenerateTimeStamp } from 'src/helpers/generateTime.helper';

@Injectable()
export class UserPaymentService {
  constructor(private prisma: PrismaService) {}

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
    const QRPayload = await this.prisma.userPayment.findUnique({
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

    if (!QRPayload) {
      throw new HttpException(
        ERROR_WHILE_GET_QR_PAYLOAD,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      timestamp: GenerateTimeStamp.getCurrentTime(),
      statusCode: HttpStatus.OK,
      QRPayload: {
        ...QRPayload,
        ...qrPayload,
      },
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
        amountLimit: amountLimit.amount,
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

  async DBTransactionTransfer(from: string, to: string, amount: number) {
    return await this.prisma.$transaction(async (tx: PrismaClient) => {
      const sender = await tx.userPayment.update({
        data: {
          balanced: {
            decrement: amount,
          },
        },
        where: {
          readyForPayment: {
            accountNumber: from,
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

  async transferToSameBank(transfer: Transfer) {
    const sender = await this.DBTransactionTransfer(
      transfer.userAccountNumber,
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

  // async transferToOtherBank(id: string, otherBank: TransferToOtherBank) {}

  async deletePayment(id: string) {
    const paymentDeleted = await this.prisma.userPayment.update({
      where: {
        accountID: id,
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
