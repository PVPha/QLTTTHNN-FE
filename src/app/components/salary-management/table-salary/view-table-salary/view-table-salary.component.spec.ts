import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTableSalaryComponent } from './view-table-salary.component';

describe('ViewTableSalaryComponent', () => {
  let component: ViewTableSalaryComponent;
  let fixture: ComponentFixture<ViewTableSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTableSalaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTableSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
