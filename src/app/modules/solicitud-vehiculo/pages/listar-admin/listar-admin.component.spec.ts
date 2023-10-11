import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAdminComponent } from './listar-admin.component';

describe('ListarAdminComponent', () => {
  let component: ListarAdminComponent;
  let fixture: ComponentFixture<ListarAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
