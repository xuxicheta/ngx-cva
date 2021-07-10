import { Component, Inject } from '@angular/core';
import { NgxCVA } from './ngx-cva.interface';
import {
  ControlValueAccessor,
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ngxCVA } from './ngx-cva';
import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';
import { ValidatorProvider } from './validator.provider';

@Component({
  selector: 'cva-control',
  template: '<input [formControl]="formControl">',
  providers: [
    ngxCVA(),
  ]
})
export class CvaControlComponent implements NgxCVA {
  formControl = new FormControl(null, Validators.required);
}

@Component({
  selector: 'cva-array',
  template: '',
  providers: [
    ngxCVA(),
  ]
})
export class CvaArrayComponent implements NgxCVA {
  formControl = new FormArray([
    new FormControl(null, Validators.required),
    new FormControl(null, Validators.requiredTrue),
    new FormControl(2, Validators.min(10)),
    new FormControl(),
  ]);

  constructor(
    private validatorProvider: ValidatorProvider,
    @Inject(NG_VALUE_ACCESSOR) private va: ControlValueAccessor,
  ) {
  }
}

@Component({
  selector: 'cva-group',
  template: '',
  providers: [
    ngxCVA(),
  ]
})
export class CvaGroupComponent implements NgxCVA {
  formControl = new FormGroup({
    'first': new FormControl(null, Validators.required),
    'second': new FormControl(null, Validators.requiredTrue),
    'third': new FormControl(2, Validators.min(10)),
    fourth: new FormControl(),
  });
}

describe.only('ValidatorProvider', () => {

  describe('outer control', () => {
    let fixture: MockedComponentFixture<CvaControlComponent, { outerControl: FormControl }>;
    let outerControl: FormControl;

    beforeEach(() => MockBuilder(CvaControlComponent).keep(ReactiveFormsModule));

    beforeEach(() => {
      outerControl = new FormControl();
      fixture = MockRender('<cva-control [formControl]="outerControl"></cva-control>', {
        outerControl,
      });
    });

    it('outer control should have error same as inner control', async () => {
      fixture.detectChanges();
      expect(outerControl.errors).toEqual({ required: true });
    });

    it('outer control should remove error when control set', async () => {
      outerControl.setValue('x');
      fixture.detectChanges();
      expect(outerControl.errors).toBeNull();
    });
  });

  describe('outer ngModel', () => {
    let fixture: MockedComponentFixture<CvaControlComponent, { model: any }>;

    beforeEach(() => MockBuilder(CvaControlComponent)
      .keep(FormsModule)
      .keep(ReactiveFormsModule));

    beforeEach(() => {
      fixture = MockRender(
        '<cva-control [ngModel]="model" #field="ngModel" [class.required]="field.errors?.required"></cva-control>',
        {
          model: undefined,
        });
    });

    it('outer ngModel should have error same as inner control', async () => {
      expect(fixture.nativeElement.querySelector('.required')).toBeDefined();
    });

    it('outer ngModel should remove error when ngModel set', async () => {
      fixture.componentInstance.model = 'x';
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.required')).toBeNull();
    });
  });

  describe('outer form group', () => {
    let fixture: MockedComponentFixture<CvaControlComponent, { formGroup: FormGroup }>;
    let formGroup: FormGroup;


    beforeEach(() => MockBuilder(CvaControlComponent)
      .keep(FormsModule)
      .keep(ReactiveFormsModule));

    beforeEach(() => {
      formGroup = new FormGroup({
        name: new FormControl(),
      });
      fixture = MockRender(
        '<form [formGroup]="formGroup"><cva-control formControlName="name"></cva-control></form>',
        {
          formGroup,
        });
    });

    it('outer group should have error same as inner control', () => {
      fixture.detectChanges();
      expect(formGroup.get('name').errors).toEqual({ required: true });
      expect(formGroup.invalid).toBeTruthy();
    });

    it('outer group should remove error when group.name set', () => {
      formGroup.patchValue({ name: 'x' });
      fixture.detectChanges();
      expect(formGroup.get('name').errors).toBeNull();
      expect(formGroup.valid).toBeTruthy();
    });
  });

  describe('inner array', () => {
    let fixture: MockedComponentFixture<CvaArrayComponent, { outerControl: FormControl }>;
    let outerControl: FormControl;

    beforeEach(() => MockBuilder(CvaArrayComponent).keep(ReactiveFormsModule));

    beforeEach(() => {
      outerControl = new FormControl();
      fixture = MockRender('<cva-array [formControl]="outerControl"></cva-array>', {
        outerControl,
      });
    });

    it('should have errors when inner form array have errors', () => {
      expect(outerControl.errors).toEqual({
        controlErrors: [
          { required: true },
          { required: true },
          { min: { actual: 2, min: 10 } },
          null,
        ]
      });
    });

    it('should have no errors when inner form array have no errors', async () => {
      // fixture.detectChanges();
      outerControl.setValue([1, true, 20, 'x']);
      expect(outerControl.errors).toBeNull();
    });
  });

  describe('inner form group', () => {
    let fixture: MockedComponentFixture<CvaGroupComponent, { outerControl: FormControl }>;
    let outerControl: FormControl;

    beforeEach(() => MockBuilder(CvaGroupComponent).keep(ReactiveFormsModule));

    beforeEach(() => {
      outerControl = new FormControl();
      fixture = MockRender('<cva-group [formControl]="outerControl"></cva-group>', {
        outerControl,
      });
    });

    it('should have errors when inner form group have errors', () => {
      expect(outerControl.errors).toEqual({
        controlErrors: {
          first: { required: true },
          second: { required: true },
          third: { min: { actual: 2, min: 10 } },
          fourth: null,
        },
      });
    });
  });
});
