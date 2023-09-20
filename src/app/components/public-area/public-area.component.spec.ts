import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicAreaComponent } from './public-area.component';

describe('PublicAreaComponent', () => {
  let component: PublicAreaComponent;
  let fixture: ComponentFixture<PublicAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
