import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScannerBarcodeButtonComponent } from './scanner-barcode-button.component';

describe('ScannerBarcodeButtonComponent', () => {
  let component: ScannerBarcodeButtonComponent;
  let fixture: ComponentFixture<ScannerBarcodeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScannerBarcodeButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScannerBarcodeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
