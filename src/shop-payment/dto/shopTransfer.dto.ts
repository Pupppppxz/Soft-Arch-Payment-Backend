import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Length,
  Max,
  Min,
  Validate,
} from 'class-validator';
import { isValidShopAccountNumber } from 'src/actions/customValidator/shopPayment.validator';
import { BANK_NAME, TRANSFER_TYPE } from 'src/assets/paymentStatic/payment';

export class ShopTransfer {
  @ApiProperty()
  @IsNotEmpty()
  @Length(10, 10)
  @Validate(isValidShopAccountNumber)
  shopAccountNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  shopName: string;

  @ApiProperty()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  otherAccountNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nameOther: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(Object.values(BANK_NAME))
  bankNameOther: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100000)
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  fee: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(Object.values(TRANSFER_TYPE))
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  IPAddress: string;
}
