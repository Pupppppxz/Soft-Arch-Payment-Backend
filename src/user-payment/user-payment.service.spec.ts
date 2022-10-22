import { Test, TestingModule } from '@nestjs/testing';
import { UserPaymentService } from './user-payment.service';

describe('UserPaymentService', () => {
  let service: UserPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPaymentService],
    }).compile();

    service = module.get<UserPaymentService>(UserPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
