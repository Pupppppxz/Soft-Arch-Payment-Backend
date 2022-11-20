import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DepositDto {
  @ApiProperty()
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  accountID: string;

  @ApiProperty()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  fee: number;
}
