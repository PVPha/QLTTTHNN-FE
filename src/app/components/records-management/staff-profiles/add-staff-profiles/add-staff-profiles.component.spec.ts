import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStaffProfilesComponent } from './add-staff-profiles.component';

describe('AddStaffProfilesComponent', () => {
  let component: AddStaffProfilesComponent;
  let fixture: ComponentFixture<AddStaffProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStaffProfilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStaffProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
