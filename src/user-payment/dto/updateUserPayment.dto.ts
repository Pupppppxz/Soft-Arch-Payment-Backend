import { PartialType } from '@nestjs/swagger';
import { CreateUserPaymentDto } from './createUserPayment.dto';

export class UpdateUserPaymentDto extends PartialType(CreateUserPaymentDto) {}
