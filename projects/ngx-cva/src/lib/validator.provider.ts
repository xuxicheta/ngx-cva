import { ChangeDetectorRef, EmbeddedViewRef, Inject, Injectable, Optional } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, ValidationErrors, Validator } from '@angular/forms';
import { NgxCVA } from './ngx-cva.interface';
import { appendToObject } from './append-to-object';
import { LINKED_CVA } from './linked-cva.token';

@Injectable()
export class ValidatorProvider implements Validator {
  get formControl(): AbstractControl {
    return ((this.cdr as EmbeddedViewRef<any>)?.context as NgxCVA)?.formControl;
  }

  constructor(
    @Optional() private cdr: ChangeDetectorRef,
    @Optional() @Inject(LINKED_CVA) private linked: boolean,
  ) {
  }

  validate(x): ValidationErrors | null {
    if (!this.linked) {
      return null;
    }

    if (this.formControl instanceof FormArray) {
      return this.collectErrorsOfFormArray(this.formControl)
    }

    if (this.formControl instanceof FormGroup) {
      return this.collectErrorsOfFormGroup(this.formControl);
    }

    return this.formControl.errors;
  }

  private collectErrorsOfFormArray(formControl: FormArray): ValidationErrors | null {
    let errors: ValidationErrors | null = null;

    if (formControl.errors) {
      errors = { ...this.formControl.errors};
    }

    const controlErrors = formControl.controls.map(ctrl => ctrl.errors);
    if (controlErrors.some(Boolean)) {
      errors = {
        ...errors,
        controlErrors,
      }
    }

    return errors;
  }

  private collectErrorsOfFormGroup(formControl: FormGroup): ValidationErrors | null {
    let errors: ValidationErrors | null = null;

    if (formControl.errors) {
      errors = { ...this.formControl.errors};
    }

    if (Object.values(formControl.controls).some(ctrl => ctrl.errors)) {
      errors = {
        ...errors,
        controlErrors: Object.entries(formControl.controls).reduce(
          (acc, [key, ctrl]) => appendToObject(acc, key, ctrl.errors),
          {} as any,
        )
      }
    }

    return errors;
  }

}
