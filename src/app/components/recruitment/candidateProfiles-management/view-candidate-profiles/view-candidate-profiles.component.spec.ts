import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCandidateProfilesComponent } from './view-candidate-profiles.component';

describe('ViewCandidateProfilesComponent', () => {
  let component: ViewCandidateProfilesComponent;
  let fixture: ComponentFixture<ViewCandidateProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCandidateProfilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCandidateProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
