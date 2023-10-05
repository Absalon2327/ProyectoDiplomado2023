import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientosvalesComponent } from './movimientosvales.component';

describe('MovimientosvalesComponent', () => {
  let component: MovimientosvalesComponent;
  let fixture: ComponentFixture<MovimientosvalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovimientosvalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovimientosvalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
