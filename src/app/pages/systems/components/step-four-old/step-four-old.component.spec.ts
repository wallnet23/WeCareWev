import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepFourOldComponent } from './step-four-old.component';

describe('ProductInfoComponent', () => {
  let component: StepFourOldComponent;
  let fixture: ComponentFixture<StepFourOldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepFourOldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepFourOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
