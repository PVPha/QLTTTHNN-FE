import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTableTimekeepingComponent } from './view-table-timekeeping.component';

describe('ViewTableTimekeepingComponent', () => {
  let component: ViewTableTimekeepingComponent;
  let fixture: ComponentFixture<ViewTableTimekeepingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTableTimekeepingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTableTimekeepingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
