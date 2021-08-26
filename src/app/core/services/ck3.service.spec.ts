import { TestBed } from '@angular/core/testing';

import { Ck3Service } from './ck3.service';

describe('Ck3Service', () => {
  let service: Ck3Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ck3Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
