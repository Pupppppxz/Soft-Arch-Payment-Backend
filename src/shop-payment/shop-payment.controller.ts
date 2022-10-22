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
import { CreateShopPaymentDto } from './dto/create-shop-payment.dto';
import { UpdateAmountDto } from './dto/update-shop-payment.dto';

@Controller('shop-payment')
export class ShopPaymentController {
  constructor(private readonly shopPaymentService: ShopPaymentService) {}

  @Post()
  create(@Body() createShopPaymentDto: CreateShopPaymentDto) {
    return this.shopPaymentService.create(createShopPaymentDto);
  }

  @Get()
  findAll() {
    return this.shopPaymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopPaymentService.findOne(+id);
  }

  @Patch(':id')
  updateAmount(
    @Param('id') id: string,
    @Body() updateAmountDto: UpdateAmountDto,
  ) {
    return this.shopPaymentService.updateAmount(id, updateAmountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopPaymentService.remove(+id);
  }
}
