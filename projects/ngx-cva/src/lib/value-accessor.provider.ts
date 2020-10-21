import { AbstractControl, ControlValueAccessor } from '@angular/forms';
import { BehaviorSubject, noop, Subscription } from 'rxjs';
import { ChangeDetectorRef, EmbeddedViewRef, Injectable, OnDestroy, Optional } from '@angular/core';
import { NgxCVA } from './ngx-cva.interface';

@Injectable()
export class ValueAccessorProvider<V = any> implements ControlValueAccessor, OnDestroy {
  onChanges = new BehaviorSubject<object>({});
  private sub = new Subscription();

  get formControl(): AbstractControl {
    return ((this.cdr as EmbeddedViewRef<any>)?.context as NgxCVA)?.formControl;
  }

  constructor(
    @Optional() private cdr: ChangeDetectorRef,
    private linked: boolean,
  ) {
  }

  onChange: (v?: any) => void = noop;
  onTouched: () => void = noop;

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  registerOnChange(onChange: (v?: V) => void): void {
    this.onChange = onChange;

    if (this.linked) {
      this.sub.add(this.linkInnerControlToOutwards());
      this.sub.add(this.linkOutwardsToInnerControl());
    }
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  writeValue(value: object): void {
    this.onChanges.next(value);
  }

  protected patchValue(value: V): void {
    this.formControl.patchValue(this.invokeSafeValue(value), { emitEvent: false });
  }

  protected invokeSafeValue(value: V): V {
    if (Array.isArray(this.formControl.value)) {
      return (value ?? []) as V;
    }
    if (typeof (this.formControl.value) === 'object') {
      return (value ?? {}) as V;
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

  protected linkOutwardsToInnerControl(): Subscription {
    if (this.formControl) {
      return this.onChanges.subscribe(value => {
        this.formControl.patchValue(value, { emitEvent: false });
      });
    }

    return Subscription.EMPTY;
  }
}
