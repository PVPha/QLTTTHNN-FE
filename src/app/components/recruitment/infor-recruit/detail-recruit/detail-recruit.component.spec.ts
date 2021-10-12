import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRecruitComponent } from './detail-recruit.component';

describe('DetailRecruitComponent', () => {
  let component: DetailRecruitComponent;
  let fixture: ComponentFixture<DetailRecruitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailRecruitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailRecruitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
