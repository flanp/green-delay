import { SessionService } from 'src/app/core/services/session.service';
import { Router } from '@angular/router';
import { StreamService } from '../stream.service';
import { SearchStream } from '../../../core/models/search/search-stream.model';
import { Component, OnInit } from '@angular/core';
import { AuthorizationHelper } from '../../../core/helpers/authorization.helper';
import { ConfirmationService } from 'primeng/api';
import { Stream } from '../stream.model';
import { VideoSessionService } from 'src/app/core/services/video-session.service';
import { environment } from 'src/environments/environment';
import { ToastService } from 'src/app/core/services/toast.service';
import { UserService } from 'src/app/core/services/user.service';
import { UserContextService } from 'src/app/core/services/user-context.service';
import {
  StreamRating,
  streamRatingsList,
} from 'src/app/core/enums/streamRating.enum';
import { StatsInputModalComponent } from 'src/app/shared/stats-input-modal/stats-input-modal.component';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-admin-stream-list',
  templateUrl: './admin-stream-list.component.html',
  styleUrls: ['./admin-stream-list.component.scss'],
})
export class AdminStreamListComponent implements OnInit {
  columns: any[];
  streams: Stream[];
  pageSize = 20;
  pageNumber = 0;
  totalRecords: number;
  loading: boolean;

  streamRatingsList = streamRatingsList;
  streamRatings = StreamRating;
  searchStream = new SearchStream();
  pageSizes = [
    {
      label: '20',
      value: 20,
    },
    {
      label: '50',
      value: 50,
    },
    {
      label: '100',
      value: 100,
    },
  ];

  constructor(
    private streamService: StreamService,
    private confirmationService: ConfirmationService,
    public authorizationHelper: AuthorizationHelper,
    private sessionService: SessionService,
    private toastService: ToastService,
    private userService: UserService,
    private userContextService: UserContextService,
    private router: Router,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.columns = [
      { field: 'title', header: 'Título' },
      { field: 'startDate', header: 'Data e Hora de Início' },
      // Removed 'Autor' and 'Avaliação' columns
    ];
  
    this.searchFormChanged();
  }
  

  goToStreamDetail(stream: Stream) {
    console.log('Stream detail is deactivated...');
    return;
  }

  addStats(stream: Stream) {
    this.dialogService.open(StatsInputModalComponent, {
      header: 'Alterar link das estatísticas',
      data: {
        streamId: stream.id,
        statsLink: stream.statsLink,
        width: '50%',
      },
    });
  }

  startStream(stream: Stream) {
    this.sessionService.setItem('stream-options-' + stream.id, {
      videoSource: 'screen',
    });
    this.sessionService.setItem('current-stream', stream);
    const streamName = stream.title.split(' ').join('').toLowerCase();
    window.open(
      `${environment.ownUrl}/full-screen/sessao/produtor/${streamName}`,
      streamName,
      'width=600,height=600,left=200,top=200,toolbar=no,menubar=no,location=no'
    );
  }

  watchStream(stream: Stream) {
    if (stream.isActive) {
      this.userService.isActive().subscribe(result => {
        if (!result.exists) {
          this.toastService.addSingle('error', '', 'A sua conta não existe');
          this.userContextService.logout();
          this.router.navigate(['/login']);
        } else if (!result.isActive) {
          this.toastService.addSingle('warn', '', 'A sua conta não está ativa');
        } else {
          this.sessionService.setItem('stream-options-' + stream.id, {
            videoSource: 'screen',
          });
          this.sessionService.setItem('current-stream', stream);
          const streamName = stream.title.split(' ').join('').toLowerCase();
          window.open(
            `${environment.ownUrl}/full-screen/sessao/consumidor/${streamName}`,
            '',
            'width=600,height=400,left=200,top=200'
          );
        }
      });
    }
  }

  getStatus(streamId: number) {
    this.streamService
      .getStatus(streamId)
      .subscribe(
        count =>
          (this.streams.find(stream => stream.id === streamId).isActive =
            count > 0)
      );
  }

  onEditComplete(event) {
    let changedStream = event.data;

    // rating
    if (typeof event.data.rating === 'object') {
      changedStream.rating = event.data.rating.value;
    }

    // start date
    if (
      !isNaN(new Date(event.data.startDate).getTime()) &&
      !isNaN(new Date(event.data.startTime).getTime())
    ) {
      var dt = new Date(event.data.startDate);
      var dtTime = new Date(event.data.startTime);
      changedStream.startDate = new Date(
        dt.getFullYear(),
        dt.getMonth(),
        dt.getDate(),
        dtTime.getHours(),
        dtTime.getMinutes(),
        0
      );
      changedStream.startTime = changedStream.startDate;
    } else if (
      !isNaN(new Date(event.data.startDate).getTime()) &&
      isNaN(new Date(event.data.startTime).getTime())
    ) {
      var dt = new Date(event.data.startDate);
      var time = event.data.startTime.split(':');
      changedStream.startDate = new Date(
        dt.getFullYear(),
        dt.getMonth(),
        dt.getDate(),
        time[0],
        time[1],
        0
      );
      changedStream.startTime = changedStream.startDate;
    }

    // submit
    let index = this.streams.indexOf(
      this.streams.find(x => x.id === event.data.id)
    );
    this.streams[index] = changedStream;
    this.streams = this.streams.slice();

    this.streamService.updateStream(changedStream).subscribe();
  }

  removeStream(stream: Stream) {
    this.confirmationService.confirm({
      message:
        'Esta ação é irreversível, tem a certeza que quer eliminar esta stream?',
      accept: () => {
        this.streamService.deleteStream(stream.id).subscribe(_ => {
          this.toastService.addSingle(
            'success',
            '',
            'Stream eliminada com sucesso'
          );
          this.searchFormChanged();
        });
      },
      reject: () => {
        console.log('Abortar eliminar stream');
      },
    });
  }

  pageSizeChanged() {
    this.searchFormChanged();
  }

  searchFormChanged(event?: any) {
    this.loading = true;
    this.searchStream.pageNumber = event ? event.first / this.pageSize : 0;
    this.searchStream.pageSize = this.pageSize;

    this.streamService.getStreams(this.searchStream).subscribe(streams => {
      this.pageSize = streams.pageSize;
      this.pageNumber = streams.pageNumber;
      this.streams = streams.data.map(stream => {
        stream.startTime = stream.startDate;
        return stream;
      });
      this.totalRecords = streams.numberOfRecords;
      this.loading = false;

      this.streams.forEach(stream => {
        this.getStatus(stream.id);
      });
    });
  }
}
