import { SessionService } from '../../../core/services/session.service';
import { ToastService } from '../../../core/services/toast.service';
import { User } from '../../user/user.model';
import { UserContextService } from 'src/app/core/services/user-context.service';
import {
  OpenVidu,
  Session,
  StreamEvent,
  ConnectionEvent,
  Subscriber,
  SessionDisconnectedEvent,
} from 'openvidu-browser';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { AuthorizationHelper } from 'src/app/core/helpers/authorization.helper';
import { VideoSessionService } from 'src/app/core/services/video-session.service';
import { Stream } from '../../stream/stream.model';
import {
  DomSanitizer,
  SafeResourceUrl,
  Title,
} from '@angular/platform-browser';
import { StreamService } from '../../stream/stream.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-session-subscriber',
  templateUrl: './session-subscriber.component.html',
  styleUrls: ['./session-subscriber.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SessionSubscriberComponent implements OnInit, OnDestroy {
  stream: Stream;

  OV: OpenVidu;
  session: Session;

  token: string;

  user: User;

  isVideoPlaying = true;
  isAudioPlaying = true;
  isLoading = true;
  showStats = false;
  statsLink: SafeResourceUrl;

  subscriber: Subscriber;

  constructor(
    public authorizationHelper: AuthorizationHelper,
    private videoSessionService: VideoSessionService,
    private toastService: ToastService,
    private sessionService: SessionService,
    private userContextService: UserContextService,
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private streamService: StreamService
  ) {}

  OPEN_VIDU_CONNECTION() {
    // 0) Obtain 'token' from server
    // In this case, the method ngOnInit takes care of it

    // 1) Initialize OpenVidu and your Session
    this.OV = new OpenVidu();
    this.session = this.OV.initSession();

    // 2) Specify the actions when events take place
    this.session.on('streamCreated', (event: StreamEvent) => {
      console.warn('STREAM CREATED!');
      console.warn(event.stream);
      this.subscriber = this.session.subscribe(event.stream, 'subscriber', {
        insertMode: 'APPEND',
        subscribeToAudio: true,
        subscribeToVideo: true,
      });
    });

    this.session.on('streamDestroyed', (event: StreamEvent) => {
      console.warn('STREAM DESTROYED!');
      console.warn(event.stream);
      this.toastService.addSingle(
        'warn',
        'A transmissão foi finalizada.',
        'Esta janela vai-se fechar em 5 segundos'
      );
      setTimeout(() => window.close(), 5000);
    });

    this.session.on('connectionCreated', (event: ConnectionEvent) => {
      console.log('connection', event.connection);
      if (
        event.connection.connectionId === this.session.connection.connectionId
      ) {
        console.warn('YOUR OWN CONNECTION CREATED!');
      } else {
        console.warn("OTHER USER'S CONNECTION CREATED!");
      }
      console.warn(event.connection);
    });

    this.session.on('connectionDestroyed', (event: ConnectionEvent) => {
      if (
        event.connection.connectionId === this.session.connection.connectionId
      ) {
        console.warn('YOUR OWN CONNECTION DESTROYED!');
        this.toastService.addSingle(
          'warn',
          'O administrador desconectou-o da stream',
          'Esta janela vai-se fechar em 5 segundos'
        );
        setTimeout(() => window.close(), 5000);
      } else {
        console.warn("OTHER USER'S CONNECTION DESTROYED!");
      }
    });

    this.session.on('sessionDisconnected', (event: SessionDisconnectedEvent) => {
      console.warn('YOU WERE DISCONNECTED!');
      this.toastService.addSingle(
        'warn',
        'O administrador desconectou-o da stream',
        'Esta janela vai-se fechar em 5 segundos'
      );
      setTimeout(() => window.close(), 5000);
    });

    // 3) Connect to the session
    this.session
      .connect(this.token, 'CLIENT:' + this.user.username)
      .then(() => {})
      .catch(error => {
        console.log(
          'There was an error connecting to the session:',
          error.code,
          error.message
        );
      });
  }

  ngOnInit() {
    this.userContextService.user$.subscribe(user => (this.user = user));
    // Specific aspects of this concrete application
    this.previousConnectionStuff();

    // If the user is a user: gets a token (with SUBSCRIBER role)
    this.videoSessionService.generateToken(this.stream.id).subscribe(
      response => {
        // {0: token}
        this.token = response as string;
        console.warn('Token: ' + this.token);
        this.OPEN_VIDU_CONNECTION();
      },
      error => {
        if (error.status === 409) {
          this.toastService.addSingle(
            'info',
            'Ainda não começou',
            'O stream selecionado ainda não começou'
          );
        } else {
          this.toastService.addSingle(
            'warn',
            '',
            'Esta janela vai-se fechar em 5 segundos'
          );
          setTimeout(() => window.close(), 5000);
        }
      }
    );

    this.isLoading = false;
  }

  ngOnDestroy() {
    this.videoSessionService
      .deleteUser(this.stream.id, this.user.username)
      .subscribe(
        () => {
          console.warn('You have succesfully left the stream');
        },
        error => {
          console.log(error);
        }
      );

    if (this.OV) {
      // TODO: try unsubscribe
      this.session.disconnect();
    }
  }

  previousConnectionStuff() {
    this.stream = this.sessionService.getItem('current-stream') as Stream;
    this.titleService.setTitle(this.stream.title);
    this.extractStatsLink(this.stream.statsLink);

    setInterval(() => console.log(this.subscriber.stream.hasAudio), 1000);
  }

  private extractStatsLink(statsLink: string) {
    if (statsLink) {
      const src = statsLink.match('src="(.*?)"')[0].split('src="')[1];
      this.statsLink = this.sanitizer.bypassSecurityTrustResourceUrl(
        src.slice(0, src.length - 1)
      );
    }
  }

  @ViewChild('subscriber', undefined) subscriberRef: ElementRef;
  toggleStats() {
    const video = this.subscriberRef.nativeElement.children[0] as HTMLElement;
    if (video) {
      if (!this.showStats) {
        if (!this.stream.statsLink) {
          this.streamService
            .getStream(this.stream.id)
            .pipe(take(1))
            .subscribe(stream => this.extractStatsLink(stream.statsLink));
        }

        video.classList.remove('full');
        video.classList.add('reduced');
        this.showStats = true;
      } else {
        video.classList.remove('reduced');
        video.classList.add('full');
        this.showStats = false;
      }
    }
  }

  changeVideoPlay() {
    this.isVideoPlaying = !this.isVideoPlaying;
    this.subscriber.subscribeToVideo(this.isVideoPlaying);
  }

  showVolume: boolean = false;
  currentVolume: number = 1;
  timeout: NodeJS.Timer;

  muteAudio() {
    this.isAudioPlaying = false;
    this.subscriber.subscribeToAudio(this.isAudioPlaying);
    document.getElementsByTagName('video')[0].volume = 0.0;
    this.currentVolume = document.getElementsByTagName('video')[0].volume;
    this.showVolume = true;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => (this.showVolume = false), 2000);
  }

  decreaseAudioVolume() {
    const video = document.getElementsByTagName('video')[0];
    if (video.volume === 0.0) {
      return;
    } else if (video.volume === 0.25) {
      this.muteAudio();
    } else {
      video.volume -= 0.25;
    }

    this.currentVolume = document.getElementsByTagName('video')[0].volume;

    this.showVolume = true;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => (this.showVolume = false), 2000);
  }

  increaseAudioVolume() {
    const video = document.getElementsByTagName('video')[0];
    if (!this.isAudioPlaying) {
      this.isAudioPlaying = true;
      this.subscriber.subscribeToAudio(this.isAudioPlaying);
      video.volume = 0.25;
      this.currentVolume = 0.25;
      this.showVolume = true;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => (this.showVolume = false), 2000);
      return;
    }

    if (video.volume === 1.0) {
      return;
    }

    video.volume += 0.25;
    this.currentVolume = document.getElementsByTagName('video')[0].volume;

    this.showVolume = true;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => (this.showVolume = false), 2000);
  }
}
