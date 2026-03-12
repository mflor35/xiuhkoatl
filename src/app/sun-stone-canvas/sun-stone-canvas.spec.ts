import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SunStoneCanvas } from './sun-stone-canvas';

describe('SunStoneCanvas', () => {
  let component: SunStoneCanvas;
  let fixture: ComponentFixture<SunStoneCanvas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SunStoneCanvas],
    }).compileComponents();

    fixture = TestBed.createComponent(SunStoneCanvas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
