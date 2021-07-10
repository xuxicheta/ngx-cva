import { Provider } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessorProvider } from './value-accessor.provider';
import { ValidatorProvider } from './validator.provider';
import { LINKED_CVA } from './linked-cva.token';

export function ngxCVA(linked = true): Provider[] {
  return [
    {
      provide: LINKED_CVA,
      useValue: linked,
    },
    ValueAccessorProvider,
    ValidatorProvider,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ValueAccessorProvider,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: ValidatorProvider,
      multi: true,
    }];
}
