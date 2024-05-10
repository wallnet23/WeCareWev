import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncompleteDialogComponent } from './incomplete-dialog.component';

describe('IncompleteDialogComponent', () => {
  let component: IncompleteDialogComponent;
  let fixture: ComponentFixture<IncompleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncompleteDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IncompleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
