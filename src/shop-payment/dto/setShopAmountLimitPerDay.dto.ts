import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class SetShopAmountLimitPerDayDTO {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  shopID: string;

  @ApiProperty()
  @IsNotEmpty()
  amount: number;
}
