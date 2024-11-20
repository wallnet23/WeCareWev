import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScannerSelectorComponent } from './scanner-selector.component';

describe('ScannerSelectorComponent', () => {
  let component: ScannerSelectorComponent;
  let fixture: ComponentFixture<ScannerSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScannerSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScannerSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
