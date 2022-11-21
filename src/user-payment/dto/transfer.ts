import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { isValidUserAccountNumber } from 'src/actions/customValidator/userPayment.validator';
import { BANK_NAME } from 'src/assets/paymentStatic/payment';

export class UserTransfer {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  @Length(10, 10)
  @Validate(isValidUserAccountNumber)
  userAccountNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userAccountName: string;

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
  @IsIn(Object.values(BANK_NAME))
  bankNameOther: string;

  @ApiProperty()
  @IsNotEmpty()
  sourcePhone: string;

  @ApiProperty()
  @IsNotEmpty()
  destPhone: string;

  @ApiProperty()
  @IsNotEmpty()
  IPAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  ref: string;

  @ApiProperty()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  fee: number;

  @ApiProperty()
  @IsNotEmpty()
  sourceEmail: string;

  @ApiProperty()
  @IsNotEmpty()
  destEmail: string;
}
