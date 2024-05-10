import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatterySystemComponent } from './battery-system.component';

describe('BatterySystemComponent', () => {
  let component: BatterySystemComponent;
  let fixture: ComponentFixture<BatterySystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatterySystemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BatterySystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
