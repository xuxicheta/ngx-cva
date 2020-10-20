import { TestBed } from '@angular/core/testing';

import { NgxCvaService } from './ngx-cva.service';

describe('NgxCvaService', () => {
  let service: NgxCvaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxCvaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
