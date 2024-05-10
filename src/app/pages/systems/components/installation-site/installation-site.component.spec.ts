import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallationSiteComponent } from './installation-site.component';

describe('InstallationSiteComponent', () => {
  let component: InstallationSiteComponent;
  let fixture: ComponentFixture<InstallationSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstallationSiteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstallationSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
