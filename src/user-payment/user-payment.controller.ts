import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserPaymentService } from './user-payment.service';
import { CreateUserPaymentDto } from './dto/createUserPayment.dto';
import { Transfer } from './dto/transfer';
import { GetQRPayload } from './dto/getQRPayload.dto';
import { SetAmountLimitPerDay } from './dto/setAmountLimit.dto';
// import { HttpExceptionFilter } from './../filter/httpException.filter';

@Controller('user-payment')
export class UserPaymentController {
  constructor(private readonly userPaymentService: UserPaymentService) {}

  @Post('create')
  createPayment(@Body() createUserPaymentDto: CreateUserPaymentDto) {
    return this.userPaymentService.createPayment(createUserPaymentDto);
  }

  @Get('info/:id')
  getInformation(@Param('id') id: string) {
    return this.userPaymentService.getInformation(id);
  }

  @Get('balanced/:id')
  getAccountBalanced(@Param('id') id: string) {
    return this.userPaymentService.getUserBalanced(id);
  }

  @Get('qr/payload')
  getAccountQRPayload(@Body() qrPayload: GetQRPayload) {
    return this.userPaymentService.getQRPayload(qrPayload);
  }

  @Get('limit/day/:id')
  getAccountLimitPerDay(@Param('id') id: string) {
    return this.userPaymentService.getAmountLimitPerDay(id);
  }

  @Patch('limit/day')
  setAccountAmountLimitPerDay(@Body() amountLimit: SetAmountLimitPerDay) {
    return this.userPaymentService.setAmountLimitPerDay(amountLimit);
  }

  @Get('allow/:id')
  getAllowPayment(@Param('id') id: string) {
    return this.userPaymentService.getIsAccountAllowPayment(id);
  }

  @Patch('payment/block/:id')
  blockAccountPaymentMethod(@Param('id') id: string) {
    return this.userPaymentService.blockPayment(id);
  }

  @Patch('payment/unblock/:id')
  unblockAccountPaymentMethod(@Param('id') id: string) {
    return this.userPaymentService.unBlockPayment(id);
  }

  @Post('transfer/same')
  transferToSameBank(@Body() transfer: Transfer) {
    return this.userPaymentService.transferToSameBank(transfer);
  }

  @Delete('remove/:id')
  deleteAccountPayment(@Param('id') id: string) {
    return this.userPaymentService.deletePayment(id);
  }

  @Patch('restore/:id')
  restoreAccountPayment(@Param('id') id: string) {
    return this.userPaymentService.restorePayment(id);
  }
}
