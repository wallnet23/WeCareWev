import { TestBed } from '@angular/core/testing';

import { IpInfoConnectService } from './ip-info-connect.service';

describe('IpInfoConnectService', () => {
  let service: IpInfoConnectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IpInfoConnectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
