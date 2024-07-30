import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemNewComponent } from './system-new.component';

describe('SystemNewComponent', () => {
  let component: SystemNewComponent;
  let fixture: ComponentFixture<SystemNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
