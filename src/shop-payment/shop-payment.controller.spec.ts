import { Test, TestingModule } from '@nestjs/testing';
import { ShopPaymentController } from './shop-payment.controller';
import { ShopPaymentService } from './shop-payment.service';

describe('ShopPaymentController', () => {
  let controller: ShopPaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopPaymentController],
      providers: [ShopPaymentService],
    }).compile();

    controller = module.get<ShopPaymentController>(ShopPaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
