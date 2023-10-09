import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDecanoComponent } from './home-decano.component';

describe('HomeDecanoComponent', () => {
  let component: HomeDecanoComponent;
  let fixture: ComponentFixture<HomeDecanoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeDecanoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeDecanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
