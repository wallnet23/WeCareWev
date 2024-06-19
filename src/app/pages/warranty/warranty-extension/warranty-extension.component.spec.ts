import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantyExtensionComponent } from './warranty-extension.component';

describe('WarrantyExtensionComponent', () => {
  let component: WarrantyExtensionComponent;
  let fixture: ComponentFixture<WarrantyExtensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarrantyExtensionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WarrantyExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
