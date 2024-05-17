import { TestBed } from '@angular/core/testing';

import { AssistanceRequestsService } from './assistance-requests.service';

describe('AssistanceRequestsServiceService', () => {
  let service: AssistanceRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssistanceRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
