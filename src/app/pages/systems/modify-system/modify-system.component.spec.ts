import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifySystemComponent } from './modify-system.component';

describe('ModifySystemComponent', () => {
  let component: ModifySystemComponent;
  let fixture: ComponentFixture<ModifySystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifySystemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifySystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
