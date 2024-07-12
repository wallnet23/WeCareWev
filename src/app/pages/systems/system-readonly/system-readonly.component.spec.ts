import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemReadonlyComponent } from './system-readonly.component';

describe('SystemReadonlyComponent', () => {
  let component: SystemReadonlyComponent;
  let fixture: ComponentFixture<SystemReadonlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemReadonlyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SystemReadonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
