import { ChangeDetectorRef, InjectionToken, Provider } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessorProvider } from './value-accessor.provider';
import { ValidatorProvider } from './validator.provider';

const LINKED_CVA = new InjectionToken<boolean>('LINKED_CVA');

export function ngxCVA(linked = true): Provider[] {
  return [{
    provide: LINKED_CVA,
    useValue: linked,
  },
    {
      provide: NG_VALUE_ACCESSOR,
      useClass: ValueAccessorProvider,
      multi: true,
      deps: [ChangeDetectorRef, LINKED_CVA],
    },
    {
      provide: NG_VALIDATORS,
      useClass: ValidatorProvider,
      multi: true,
      deps: [ChangeDetectorRef, LINKED_CVA],
    }];
}
