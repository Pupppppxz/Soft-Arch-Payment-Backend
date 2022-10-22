import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';

@Injectable()
export class AppService {
  getHello(): string {
    throw new HttpException('test error', HttpStatus.FORBIDDEN);
    // return 'Hello World!';
  }
}
