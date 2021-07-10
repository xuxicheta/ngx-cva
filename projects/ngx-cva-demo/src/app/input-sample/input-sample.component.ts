import { Component, OnInit } from '@angular/core';
import { ngxCVA, NgxCVA } from 'ngx-cva';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-sample',
  templateUrl: './input-sample.component.html',
  styleUrls: ['./input-sample.component.css'],
  providers: [
    ngxCVA()
  ]
})
export class InputSampleComponent implements OnInit, NgxCVA {
  formControl = new FormControl();

  constructor() {
  }

  ngOnInit(): void {
  }
}
