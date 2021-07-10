import { AbstractControl, ControlValueAccessor, FormArray, FormGroup } from '@angular/forms';
import { noop, Subscription } from 'rxjs';
import { ChangeDetectorRef, EmbeddedViewRef, Inject, Injectable, OnDestroy, Optional } from '@angular/core';
import { NgxCVA } from './ngx-cva.interface';
import { LINKED_CVA } from './linked-cva.token';

@Injectable()
export class ValueAccessorProvider<V = any> implements ControlValueAccessor, OnDestroy {
  onChange: (v?: any) => void = noop;
  onTouched: () => void = noop;
  private sub = new Subscription();

  constructor(
    @Optional() private cdr: ChangeDetectorRef,
    @Optional() @Inject(LINKED_CVA) private linked: boolean,
  ) {
  }

  get formControl(): AbstractControl {
    return ((this.cdr as EmbeddedViewRef<any>)?.context as NgxCVA)?.formControl;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  registerOnChange(onChange: (v?: V) => void): void {
    this.onChange = onChange;

    if (this.linked) {
      this.sub.add(this.linkInnerControlToOutwards());
    }
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  writeValue(value: V): void {
    this.patchValue(value);
  }

  protected patchValue(value: V): void {
    this.formControl?.patchValue(this.makeSafeValue(value), { emitEvent: false });
  }

  protected makeSafeValue(value: V): V {
    if (value === null && this.formControl instanceof FormArray) {
      return [] as unknown as V;
    }
    if (value === null && this.formControl instanceof FormGroup) {
      return {} as unknown as V;
    }
    return value;
  }

  protected linkInnerControlToOutwards(): Subscription {
    if (this.formControl) {
      return this.formControl.valueChanges.subscribe(value => {
        this.onTouched();
        this.onChange(value);
      });
    }

    return Subscription.EMPTY;
  }
}
