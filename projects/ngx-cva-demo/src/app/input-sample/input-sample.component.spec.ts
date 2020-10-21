import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSampleComponent } from './input-sample.component';

describe('InputSampleComponent', () => {
  let component: InputSampleComponent;
  let fixture: ComponentFixture<InputSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputSampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
