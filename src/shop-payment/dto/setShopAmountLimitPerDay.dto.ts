import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID, Max, Min } from 'class-validator';

export class SetShopAmountLimitPerDayDTO {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  shopID: string;

  @ApiProperty()
  @IsNumber()
  @Min(100000)
  @Max(1000000)
  amount: number;
}
