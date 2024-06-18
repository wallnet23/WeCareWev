import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemModifyComponent } from './system-modify.component';

describe('SystemModifyComponent', () => {
  let component: SystemModifyComponent;
  let fixture: ComponentFixture<SystemModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemModifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
