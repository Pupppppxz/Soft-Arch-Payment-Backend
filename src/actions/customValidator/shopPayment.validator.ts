import { HttpException, HttpStatus } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: '' })
export class isValidShopAccountNumber implements ValidatorConstraintInterface {
  validate(value: string): boolean | Promise<boolean> {
    if (!value) return false;
    if (value.charAt(0) === '5') {
      return true;
    }
    return false;
  }
  defaultMessage?(): string {
    throw new HttpException('Invalid account number', HttpStatus.BAD_REQUEST);
  }
}
