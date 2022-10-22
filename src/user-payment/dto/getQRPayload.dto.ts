import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { BANK_NAME } from 'src/assets/paymentStatic/payment';

export class GetQRPayload {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  accountID: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(BANK_NAME)
  bankName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  fee: number;
}
