import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsInputModalComponent } from './stats-input-modal.component';

describe('StatsInputModalComponent', () => {
  let component: StatsInputModalComponent;
  let fixture: ComponentFixture<StatsInputModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatsInputModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsInputModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
