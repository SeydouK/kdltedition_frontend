import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TkardPromo } from './tkard-promo';

describe('TkardPromo', () => {
  let component: TkardPromo;
  let fixture: ComponentFixture<TkardPromo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TkardPromo],
    }).compileComponents();

    fixture = TestBed.createComponent(TkardPromo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
