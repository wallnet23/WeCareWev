import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadDataPopupComponent } from './read-data-popup.component';

describe('ReadDataPopupComponent', () => {
  let component: ReadDataPopupComponent;
  let fixture: ComponentFixture<ReadDataPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadDataPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReadDataPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
