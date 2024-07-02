import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantyTrialComponent } from './warranty-trial.component';

describe('WarrantyTrialComponent', () => {
  let component: WarrantyTrialComponent;
  let fixture: ComponentFixture<WarrantyTrialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarrantyTrialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WarrantyTrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
