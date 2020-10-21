import { ChangeDetectorRef, EmbeddedViewRef, Injectable, Optional } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, Validator } from '@angular/forms';
import { NgxCVA } from './ngx-cva.interface';
import { appendToObject } from './append-to-object';

function formErrorsReducer(form: FormGroup): (acc: ValidationErrors, key: string) => ValidationErrors {
  const controls = form.controls;

  return (acc: ValidationErrors, key: string) => {
    if (controls[key].errors !== null) {
      return appendToObject(acc || {}, key, controls[key].errors);
    }
    return acc;
  };
}

@Injectable()
export class ValidatorProvider implements Validator {
  get formControl(): AbstractControl {
    return ((this.cdr as EmbeddedViewRef<any>)?.context as NgxCVA)?.formControl;
  }

  constructor(
    @Optional() private cdr: ChangeDetectorRef,
    private linked: boolean,
  ) {
  }

  validate(): ValidationErrors | null {
    if (!this.linked) {
      return null;
    }

    if (this.formControl instanceof FormGroup) {
      return {
        ...this.formControl.errors,
        ...Object.keys(this.formControl.controls).reduce(
          formErrorsReducer(this.formControl),
          null
        ),
      };
    }
    return this.formControl.errors;
  }

}
