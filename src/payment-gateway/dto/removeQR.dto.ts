import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveQRDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  QRRef: string;

  @ApiProperty()
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  QRUrl: string;
}
