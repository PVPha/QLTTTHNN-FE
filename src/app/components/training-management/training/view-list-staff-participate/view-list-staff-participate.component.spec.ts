import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewListStaffParticipateComponent } from './view-list-staff-participate.component';

describe('ViewListStaffParticipateComponent', () => {
  let component: ViewListStaffParticipateComponent;
  let fixture: ComponentFixture<ViewListStaffParticipateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewListStaffParticipateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewListStaffParticipateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
