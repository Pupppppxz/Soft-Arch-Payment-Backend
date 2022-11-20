import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Max,
  Min,
  Validate,
} from 'class-validator';
import { isValidShopAccountNumber } from 'src/actions/customValidator/shopPayment.validator';

export class GenerateQRDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accountName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Validate(isValidShopAccountNumber)
  accountNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  timeAmount: number;
}
