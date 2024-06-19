import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendemailModifyPasswordComponent } from './sendemail-modify-password.component';

describe('ModifyPasswordComponent', () => {
  let component: SendemailModifyPasswordComponent;
  let fixture: ComponentFixture<SendemailModifyPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendemailModifyPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendemailModifyPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
