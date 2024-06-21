import { TestBed } from '@angular/core/testing';

import { PopupDialogService } from './popup-dialog.service';

describe('PopupDialogService', () => {
  let service: PopupDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopupDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
