import { Injectable } from '@angular/core';
import { PublisherProperties } from 'openvidu-browser';
import { throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ServerBaseService } from './server-base.service';
import { HttpHeaders } from '@angular/common/http';
import { Stream } from 'src/app/features/stream/stream.model';


@Injectable({
    providedIn: 'root',
})
export class VideoSessionService {

    stream: Stream;
    cameraOptions: PublisherProperties;

    private url = 'session';

    constructor(private serverBaseService: ServerBaseService) { }

    // Returns nothing (HttpResponse)
    createSession(streamId: number) {
        return this.serverBaseService.post(this.url + '/create-session', { sessionId: streamId });
    }

    // Returns {0: sessionId, 1: token}
    generateToken(streamId: number) {
        return this.serverBaseService.post(this.url + '/generate-token', { sessionId: streamId });
    }

    deleteUser(streamId: number, username: string) {
        return this.serverBaseService.delete(this.url + '/user', { sessionId: streamId, username });
    }
}
