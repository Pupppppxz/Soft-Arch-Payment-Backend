import { PartialType } from '@nestjs/swagger';
import { CreateShopPaymentDto } from './create-shop-payment.dto';

export class UpdateAmountDto extends PartialType(CreateShopPaymentDto) {}
