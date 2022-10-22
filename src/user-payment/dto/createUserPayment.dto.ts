import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUserPaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  accountID: string;
}
