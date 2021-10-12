import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInterviewScheduleComponent } from './view-interview-schedule.component';

describe('ViewInterviewScheduleComponent', () => {
  let component: ViewInterviewScheduleComponent;
  let fixture: ComponentFixture<ViewInterviewScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewInterviewScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInterviewScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
