import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';
import { CreateUserPaymentDto } from './createUserPayment.dto';

export class UpdateUserAmountDto extends PartialType(CreateUserPaymentDto) {
  @ApiProperty()
  @IsNumberString()
  amount: number;
}
