import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSystemComponent } from './modify-system.component';

describe('NewSystemComponent', () => {
  let component: NewSystemComponent;
  let fixture: ComponentFixture<NewSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSystemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
