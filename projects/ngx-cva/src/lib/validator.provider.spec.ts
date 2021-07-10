import { Component } from '@angular/core';
import { NgxCVA } from './ngx-cva.interface'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ngxCVA } from './ngx-cva';
import { TestBed } from '@angular/core/testing';

@Component({
  selector: 'test',
  template: '<input [formControl]="formControl">',
  providers: [
    ngxCVA(),
  ]
})
export class TestComponent implements NgxCVA {
  formControl = new FormControl(null, Validators.required);
}

@Component({
  selector: 'host',
  template: '<test [formControl]="formControl"></test>',
})
export class HostComponent implements NgxCVA {
  formControl = new FormControl();
}

describe('ValidatorProvider', () => {

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [TestComponent, HostComponent],
      imports: [ReactiveFormsModule]
    })
  });

  it('outer control should have error same as inner control', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.formControl.errors).toEqual({ required: true });
  });
});
