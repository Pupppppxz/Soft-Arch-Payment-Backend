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
import { isValidUserAccountNumber } from 'src/actions/customValidator/userPayment.validator';
import { BANK_NAME, TRANSFER_TYPE } from 'src/assets/paymentStatic/payment';

export class Transfer {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  @Length(10, 10)
  @Validate(isValidUserAccountNumber)
  userAccountNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  @Length(10, 10)
  otherAccountNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nameOther: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(BANK_NAME)
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
  @IsIn(TRANSFER_TYPE)
  type: string;
}
