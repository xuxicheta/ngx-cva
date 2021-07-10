### Ngx-cva
Library for making life with ControlValueAccessor easier.
Build the custom form-control component with extra 2 lines of code.

#How to use it

You custom control component have to implement `CVAControl` interface and have `cvaProviders()` in providers. That is all.

No `NG_VALUE_ACCESSOR` and `ControlValueAccessor` or `Validator` full implementations.

```typescript
import { Component } from '@angular/core';
import { CVAControl, cvaProviders } from 'ngx-cva';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-control',
  template: '<input [formControl]="formControl" placeholder="write me...">',
  providers: [
    cvaProviders(),
  ]
})
export class ControlComponent implements CVAControl {
  formControl = new FormControl(null, Validators.required);
}

@Component({
  selector: 'app-content',
  template: '<app-control [(ngModel)]="model"></app-control>',
})
export class ContentComponent {
  model: 10
}
```


