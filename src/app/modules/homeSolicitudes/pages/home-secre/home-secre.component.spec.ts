import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSecreComponent } from './home-secre.component';

describe('HomeSecreComponent', () => {
  let component: HomeSecreComponent;
  let fixture: ComponentFixture<HomeSecreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeSecreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSecreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
