import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRecruitComponent } from './view-recruit.component';

describe('ViewRecruitComponent', () => {
  let component: ViewRecruitComponent;
  let fixture: ComponentFixture<ViewRecruitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRecruitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRecruitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
