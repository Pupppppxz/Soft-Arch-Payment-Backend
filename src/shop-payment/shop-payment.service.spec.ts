import { Test, TestingModule } from '@nestjs/testing';
import { ShopPaymentService } from './shop-payment.service';

describe('ShopPaymentService', () => {
  let service: ShopPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopPaymentService],
    }).compile();

    service = module.get<ShopPaymentService>(ShopPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
