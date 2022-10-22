import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateShopPaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  shopID: string;
}
