import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvertersComponent } from './inverters.component';

describe('InvertersComponent', () => {
  let component: InvertersComponent;
  let fixture: ComponentFixture<InvertersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvertersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvertersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
