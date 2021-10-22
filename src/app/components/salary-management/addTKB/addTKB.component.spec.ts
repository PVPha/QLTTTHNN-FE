/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddTKBComponent } from './addTKB.component';

describe('AddTKBComponent', () => {
  let component: AddTKBComponent;
  let fixture: ComponentFixture<AddTKBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTKBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTKBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
