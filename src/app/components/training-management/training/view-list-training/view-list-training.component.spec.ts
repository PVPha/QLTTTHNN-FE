import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewListTrainingComponent } from './view-list-training.component';

describe('ViewListTrainingComponent', () => {
  let component: ViewListTrainingComponent;
  let fixture: ComponentFixture<ViewListTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewListTrainingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewListTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
