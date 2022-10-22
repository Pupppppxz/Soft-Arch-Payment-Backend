import { Injectable } from '@nestjs/common';
import { CreateShopPaymentDto } from './dto/create-shop-payment.dto';
import { UpdateAmountDto } from './dto/update-shop-payment.dto';

@Injectable()
export class ShopPaymentService {
  create(createShopPaymentDto: CreateShopPaymentDto) {
    return 'This action adds a new shopPayment';
  }

  findAll() {
    return `This action returns all shopPayment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shopPayment`;
  }

  updateAmount(id: string, updateAmountDto: UpdateAmountDto) {
    return `This action updates a #${id} shopPayment`;
  }

  remove(id: number) {
    return `This action removes a #${id} shopPayment`;
  }
}
