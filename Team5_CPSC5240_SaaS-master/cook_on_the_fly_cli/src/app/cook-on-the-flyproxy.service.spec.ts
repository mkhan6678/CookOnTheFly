import { TestBed } from '@angular/core/testing';

import { CookOnTheFlyproxyService } from './cook-on-the-flyproxy.service';

describe('CookOnTheFlyproxyService', () => {
  let service: CookOnTheFlyproxyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CookOnTheFlyproxyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
