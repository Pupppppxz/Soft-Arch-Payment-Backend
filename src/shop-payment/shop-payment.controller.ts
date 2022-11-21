import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShopPaymentService } from './shop-payment.service';
import { CreateShopPaymentDto } from './dto/createShopPayment.dto';
import { SetShopAmountLimitPerDayDTO } from './dto/setShopAmountLimitPerDay.dto';
import { ShopTransfer } from './dto/shopTransfer.dto';

@Controller('shop-payment')
export class ShopPaymentController {
  constructor(private readonly shopPaymentService: ShopPaymentService) {}

  @Post('create')
  createAccount(@Body() createShopPaymentDto: CreateShopPaymentDto) {
    return this.shopPaymentService.createAccount(createShopPaymentDto);
  }

  @Get('info/:id')
  getInfo(@Param('id') id: string) {
    return this.shopPaymentService.getInformation(id);
  }

  @Get('all')
  getAllShop() {
    return this.shopPaymentService.getAllShops();
  }

  @Get('balanced/:id')
  getAccountBalanced(@Param('id') id: string) {
    return this.shopPaymentService.getAccountBalanced(id);
  }

  @Get('limit/:id')
  getAccountLimit(@Param('id') id: string) {
    return this.shopPaymentService.getAmountLimitPerDay(id);
  }

  @Patch('limit')
  setAccountLimit(@Body() amountLimit: SetShopAmountLimitPerDayDTO) {
    return this.shopPaymentService.setAmountLimitPerDay(amountLimit);
  }

  @Patch('block/:id')
  blockPayment(@Param('id') id: string) {
    return this.shopPaymentService.blockPayment(id);
  }

  @Patch('unblock/:id')
  unblockPayment(@Param('id') id: string) {
    return this.shopPaymentService.unBlockPayment(id);
  }

  @Get('is-allow/:id')
  getIsAllowPayment(@Param('id') id: string) {
    return this.shopPaymentService.getIsAccountAllowPayment(id);
  }

  @Post('transfer/same')
  transferToSameBank(transfer: ShopTransfer) {
    return this.shopPaymentService.transferToSameBank(transfer);
  }

  @Delete('remove/:id')
  remove(@Param('id') id: string) {
    return this.shopPaymentService.deletePayment(id);
  }

  @Patch('restore/:id')
  restorePayment(@Param('id') id: string) {
    return this.shopPaymentService.restorePayment(id);
  }
}
