import { TestBed } from '@angular/core/testing';

import { SkyexchangeService } from './skyexchange.service';

describe('SkyexchangeService', () => {
  let service: SkyexchangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkyexchangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
