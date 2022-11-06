import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
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
  // @IsNumberString()
  // @Type(() => Number)
  // @Min(1)
  // @Max(500000)
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  // @IsNumberString()
  // @Type(() => Number)
  // @Min(5)
  // @Max(720)
  timeAmount: number;
}
