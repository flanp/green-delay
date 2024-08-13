import { SearchStream } from './../../core/models/search/search-stream.model';
import { buildQueryString } from 'src/app/core/helpers/query-string.helper';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ServerBaseService } from 'src/app/core/services/server-base.service';
import { PaginatedResponse } from 'src/app/core/models/search/paginated-response.model';
import { Stream } from './stream.model';

@Injectable({
  providedIn: 'root',
})
export class StreamService {
  private streamUrl = 'stream';

  private currentStream: Stream;

  constructor(private serverBaseService: ServerBaseService) {}

  getStreams(
    searchStream: SearchStream
  ): Observable<PaginatedResponse<Stream>> {
    const obj = Object.assign({}, searchStream);
    const query = buildQueryString(obj);

    return this.serverBaseService.get<PaginatedResponse<Stream>>(
      this.streamUrl + '?' + query
    );
  }

  addStream(stream: Stream): Observable<number> {
    return this.serverBaseService.post<number>(
      this.streamUrl + '/register',
      stream
    );
  }

  updateStream(stream: Stream): Observable<number> {
    return this.serverBaseService.put<number>(
      this.streamUrl + `/${stream.id}`,
      stream
    );
  }

  deleteStream(streamId: number): Observable<number> {
    return this.serverBaseService.delete<number>(
      this.streamUrl + `/${streamId}`
    );
  }

  getStatus(streamId: number): Observable<number> {
    return this.serverBaseService.get<number>(
      this.streamUrl + `/${streamId}/status`
    );
  }

  addStatsLink(streamId: number, statsLink: string): Observable<number> {
    return this.serverBaseService.put<number>(
      this.streamUrl + `/${streamId}/statsLink`,
      { statsLink }
    );
  }

  getStream(streamId: number): Observable<Stream> {
    return this.serverBaseService.get<Stream>(this.streamUrl + '/' + streamId);
  }
}
