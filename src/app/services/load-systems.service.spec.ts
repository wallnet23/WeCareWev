import { TestBed } from '@angular/core/testing';

import { LoadSystemsService } from './load-systems.service';

describe('LoadSystemsService', () => {
  let service: LoadSystemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadSystemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
