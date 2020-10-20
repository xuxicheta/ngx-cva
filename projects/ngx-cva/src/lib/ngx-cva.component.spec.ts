import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxCvaComponent } from './ngx-cva.component';

describe('NgxCvaComponent', () => {
  let component: NgxCvaComponent;
  let fixture: ComponentFixture<NgxCvaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxCvaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxCvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
