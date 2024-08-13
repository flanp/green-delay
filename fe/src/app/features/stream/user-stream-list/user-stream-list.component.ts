import { SessionService } from 'src/app/core/services/session.service';
import { StreamService } from '../stream.service';
import { SearchStream } from '../../../core/models/search/search-stream.model';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthorizationHelper } from '../../../core/helpers/authorization.helper';
import { Stream } from '../stream.model';
import { StreamRating } from 'src/app/core/enums/streamRating.enum';
import { environment } from 'src/environments/environment';
import { UserContextService } from 'src/app/core/services/user-context.service';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../user/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-stream-list',
  templateUrl: './user-stream-list.component.html',
  styleUrls: ['./user-stream-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserStreamListComponent implements OnInit {
  columns: any[];
  streams: Stream[];
  totalRecords: number;
  loading: boolean;

  streamRatings = StreamRating;
  selectedCategory: string;
  searchStream = new SearchStream();

  user: User;

  constructor(
    private streamService: StreamService,
    public authorizationHelper: AuthorizationHelper,
    private sessionService: SessionService,
    private userContextService: UserContextService,
    private userService: UserService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.columns = [
      { field: 'title', header: 'Título' },
      { field: 'startDate', header: 'Data de Início' },
      { field: 'rating', header: 'Avaliação' },
    ];

    this.userContextService.user$.subscribe(user => (this.user = user));
  }

  watchStream(stream: Stream) {
    // if (stream.isActive) {
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
          streamName,
          'width=600,height=400,left=200,top=200,toolbar=no,menubar=no,location=no'
        );
      }
    });
    // }
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

  changeDataToShow(category: string) {
    this.selectedCategory = category;
    this.searchFormChanged();
  }

  searchFormChanged() {
    this.loading = true;
    this.searchStream.pageNumber = 0;
    this.searchStream.pageSize = 10000;
    this.searchStream.category = this.selectedCategory;

    this.streamService.getStreams(this.searchStream).subscribe(streams => {
      this.streams = streams.data;
      this.totalRecords = streams.numberOfRecords;
      this.loading = false;

      this.streams.forEach(stream => {
        this.getStatus(stream.id);
      });
    });
  }
}
