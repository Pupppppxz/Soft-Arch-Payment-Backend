import { Controller, Get, UseFilters } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './actions/filter/httpException.filter';

@Controller()
@UseFilters(HttpExceptionFilter)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    // throw new HttpException('test error', HttpStatus.BAD_GATEWAY);
    return this.appService.getHello();
  }
}
