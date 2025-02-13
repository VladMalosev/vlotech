import { TestBed } from '@angular/core/testing';

import { PaymentOptionService } from './payment-option.service';

describe('PaymentOptionService', () => {
  let service: PaymentOptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentOptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
