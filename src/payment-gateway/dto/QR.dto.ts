import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class QRDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  QRRef: string;

  @ApiProperty()
  @IsNotEmpty()
  accountNumber: string;
}
