import { Component, Inject } from '@angular/core';
import { cvaProviders } from './ngx-cva';
import { CVAControl } from './cva-control.interface';
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
import { ValidatorProvider } from './validator.provider';
import { MockBuilder, MockedComponentFixture, MockRender, ngMocks } from 'ng-mocks';

@Component({
  selector: 'cva-control',
  template: '<input [formControl]="formControl">',
  providers: [
    cvaProviders(),
  ]
})
export class CvaControlComponent implements CVAControl {
  formControl = new FormControl(null, Validators.required);
}

@Component({
  selector: 'cva-array',
  template: '',
  providers: [
    cvaProviders(),
  ]
})
export class CvaArrayComponent implements CVAControl {
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
    cvaProviders(),
  ]
})
export class CvaGroupComponent implements CVAControl {
  formControl = new FormGroup({
    'first': new FormControl(null, Validators.required),
    'second': new FormControl(null, Validators.requiredTrue),
    'third': new FormControl(2, Validators.min(10)),
    fourth: new FormControl(),
  });
}

describe.only('ValueAccessorProvider', () => {
  describe('outer control', () => {
    let fixture: MockedComponentFixture<CvaControlComponent, { outerControl: FormControl }>;
    let outerControl: FormControl;
    let innerControl: FormControl;

    beforeEach(() => MockBuilder(CvaControlComponent).keep(ReactiveFormsModule));

    beforeEach(() => {
      outerControl = new FormControl();
      fixture = MockRender('<cva-control [formControl]="outerControl"></cva-control>', {
        outerControl,
      });
      innerControl = ngMocks.find(CvaControlComponent).componentInstance.formControl;
    });

    it('outer control should set inner control value', async () => {
      outerControl.setValue('xxx');
      expect(innerControl.value).toEqual('xxx');
    });

    it('inner control should set outer control value', async () => {
      innerControl.setValue('xxx');
      expect(outerControl.value).toEqual('xxx');
    });
  });

  describe('outer ngModel', () => {
    let fixture: MockedComponentFixture<CvaControlComponent, { outerModel: any }>;
    let innerControl: FormControl;

    beforeEach(() => MockBuilder(CvaControlComponent)
      .keep(FormsModule)
      .keep(ReactiveFormsModule));

    beforeEach(() => {
      fixture = MockRender(
        '<cva-control [(ngModel)]="outerModel"></cva-control>',
        {
          outerModel: undefined,
        }
      );
      innerControl = ngMocks.find(CvaControlComponent).componentInstance.formControl;
    });

    it('outer ngModel should set inner control value', async () => {
      fixture.componentInstance.outerModel = 88;
      fixture.detectChanges();
      await fixture.whenStable();
      expect(innerControl.value).toBe(88);
    });

    it('inner control should set outer ngModel', async () => {
      innerControl.setValue(105);
      expect(fixture.componentInstance.outerModel).toBe(105);
    });
  });

  describe('outer form group', () => {
    let fixture: MockedComponentFixture<CvaControlComponent, { outerGroup: FormGroup }>;
    let outerGroup: FormGroup;
    let innerControl: FormControl;


    beforeEach(() => MockBuilder(CvaControlComponent)
      .keep(FormsModule)
      .keep(ReactiveFormsModule));

    beforeEach(() => {
      outerGroup = new FormGroup({
        name: new FormControl(),
      });
      fixture = MockRender(
        '<form [formGroup]="outerGroup"><cva-control formControlName="name"></cva-control></form>',
        {
          outerGroup,
        }
      );
      innerControl = ngMocks.find(CvaControlComponent).componentInstance.formControl;
    });

    it('outer group should set inner control value', () => {
      outerGroup.setValue({ name: 'ok ok' });
      expect(innerControl.value).toBe('ok ok');
    });

    it('inner control should set outer group', () => {
      innerControl.setValue('toto');
      expect(outerGroup.get('name').value).toBe('toto');
    });
  });

  describe('inner array', () => {
    let fixture: MockedComponentFixture<CvaArrayComponent, { outerControl: FormControl }>;
    let outerControl: FormControl;
    let innerArray: FormArray;

    beforeEach(() => MockBuilder(CvaArrayComponent).keep(ReactiveFormsModule));

    beforeEach(() => {
      outerControl = new FormControl();
      fixture = MockRender('<cva-array [formControl]="outerControl"></cva-array>', {
        outerControl,
      });
      innerArray = ngMocks.find(CvaArrayComponent).componentInstance.formControl;
    });

    it('outer control should set inner form array ', () => {
      outerControl.setValue([99, 999, 9999, 8]);
      expect(innerArray.controls.length).toBe(4);
      expect(innerArray.value).toEqual([99, 999, 9999, 8]);
    });

    it('inner form array should set outer control', async () => {
      innerArray.controls[0].setValue(5);
      innerArray.controls[1].setValue(50);
      innerArray.controls[2].setValue(150);
      expect(outerControl.value).toEqual([5, 50, 150, null]);
    });
  });

  describe('inner form group', () => {
    let fixture: MockedComponentFixture<CvaGroupComponent, { outerControl: FormControl }>;
    let outerControl: FormControl;
    let innerGroup: FormGroup;

    beforeEach(() => MockBuilder(CvaGroupComponent).keep(ReactiveFormsModule));

    beforeEach(() => {
      outerControl = new FormControl();
      fixture = MockRender('<cva-group [formControl]="outerControl"></cva-group>', {
        outerControl,
      });
      innerGroup = ngMocks.find(CvaGroupComponent).componentInstance.formControl;
    });

    it('outer control should set inner form group ', () => {
      outerControl.setValue({ first: 1, second: 2, third: 8 });
      expect(innerGroup.value).toEqual({ first: 1, second: 2, third: 8, fourth: null });
    });

    it('inner form group should set outer control', async () => {
      innerGroup.controls.first.setValue(5);
      innerGroup.controls.second.setValue(50);
      innerGroup.controls.third.setValue(150);
      expect(outerControl.value).toEqual({ first: 5, second: 50, third: 150, fourth: null });
    });
  });

});
