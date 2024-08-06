import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioSourcePickerComponent } from './audio-source-picker.component';

describe('AudioSourcePickerComponent', () => {
  let component: AudioSourcePickerComponent;
  let fixture: ComponentFixture<AudioSourcePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AudioSourcePickerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioSourcePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
