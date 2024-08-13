import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'src/app/core/services/toast.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

class AudioKeyValue {
  label: string;
  value: string;
}

@Component({
  selector: 'app-audio-source-picker',
  templateUrl: './audio-source-picker.component.html',
  styleUrls: ['./audio-source-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AudioSourcePickerComponent implements OnInit {
  chooseAudioForm: FormGroup;
  audioSources: AudioKeyValue[];

  constructor(
    private formBuilder: FormBuilder,
    private ref: DynamicDialogRef
  ) {}

  ngOnInit() {
    this.chooseAudioForm = this.formBuilder.group({
      audioSource: ['', Validators.required],
    });

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(_ => {
        navigator.mediaDevices.enumerateDevices().then(val => {
          let audioSources: AudioKeyValue[] = [];
          val
            .filter(
              x =>
                x.kind === 'audioinput' &&
                x.deviceId !== 'default' &&
                x.deviceId !== 'communications'
            )
            .map(x => {
              var audioKeyValue = new AudioKeyValue();
              audioKeyValue.label = x.label;
              audioKeyValue.value = x.deviceId;
              return audioKeyValue;
            })
            .forEach(item => {
              var i = audioSources.findIndex(x => x.value == item.value);
              if (i <= -1) {
                audioSources.push(item);
              }
            });

          this.audioSources = audioSources;

          this.chooseAudioForm.controls.audioSource.setValue(
            this.audioSources[0]
          );
        });
      })
      .catch(err => this.ref.close(err));
  }

  chooseAudio() {
    if (this.chooseAudioForm.valid) {
      this.ref.close(this.chooseAudioForm.controls.audioSource.value);
    }
  }
}
