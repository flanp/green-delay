import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'src/app/core/services/toast.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StreamService } from 'src/app/features/stream/stream.service';

@Component({
  selector: 'app-stats-input-modal',
  templateUrl: './stats-input-modal.component.html',
  styleUrls: ['./stats-input-modal.component.scss'],
})
export class StatsInputModalComponent implements OnInit {
  streamId: number;
  statsLink: string;

  constructor(
    private streamService: StreamService,
    private toastService: ToastService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.streamId = this.config.data.streamId;
    this.statsLink = this.config.data.statsLink;
  }

  changeLink() {
    if (!this.statsLink) {
      // required
      return;
    }

    if (!this.statsLink.includes('<iframe')) {
      // not valid
      return;
    }

    this.streamService
      .addStatsLink(this.streamId, this.statsLink)
      .subscribe(_ => {
        this.toastService.addSingle(
          'success',
          '',
          'Link das Estatísticas alterado com sucesso'
        );
        this.ref.close();
      });
  }
}
