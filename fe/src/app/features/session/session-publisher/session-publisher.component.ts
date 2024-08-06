import { SessionService } from '../../../core/services/session.service';
import { ToastService } from '../../../core/services/toast.service';
import { User } from '../../user/user.model';
import { UserContextService } from 'src/app/core/services/user-context.service';
import {
  OpenVidu,
  Session,
  Publisher,
  PublisherProperties,
  StreamEvent,
  ConnectionEvent,
  Subscriber,
} from 'openvidu-browser';
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewEncapsulation,
  Inject,
} from '@angular/core';
import { AuthorizationHelper } from 'src/app/core/helpers/authorization.helper';
import { VideoSessionService } from 'src/app/core/services/video-session.service';
import { DOCUMENT, Location } from '@angular/common';
import { Stream } from '../../stream/stream.model';
import { UserService } from 'src/app/core/services/user.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AudioSourcePickerComponent } from 'src/app/shared/audio-source-picker/audio-source-picker.component';
import { DialogService } from 'primeng/dynamicdialog';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-session-publisher',
  templateUrl: './session-publisher.component.html',
  styleUrls: ['./session-publisher.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SessionPublisherComponent implements OnInit, OnDestroy {
  stream: Stream;

  OV: OpenVidu;
  session: Session;
  publisher: Publisher;

  token: string;

  cameraOptions: PublisherProperties;

  localVideoActivated: boolean;
  localAudioActivated: boolean;
  videoIcon: string;
  audioIcon: string;
  fullscreenIcon: string;

  user: User;

  isVideoPlaying = true;
  isAudioPlaying = true;
  isLoading = true;

  subscribers: string[] = [];

  showSideBar = false;

  constructor(
    public location: Location,
    public authorizationHelper: AuthorizationHelper,
    private videoSessionService: VideoSessionService,
    private userContextService: UserContextService,
    private toastService: ToastService,
    private sessionService: SessionService,
    private dialogService: DialogService,
    private titleService: Title
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
      this.session.subscribe(event.stream, 'subscriber', {
        insertMode: 'APPEND',
      });
    });

    this.session.on('streamDestroyed', (event: StreamEvent) => {
      console.warn('STREAM DESTROYED!');
      console.warn(event.stream);
    });

    this.session.on('connectionCreated', (event: ConnectionEvent) => {
      if (
        event.connection.connectionId === this.session.connection.connectionId
      ) {
        console.warn('YOUR OWN CONNECTION CREATED!');
      } else {
        console.warn("OTHER USER'S CONNECTION CREATED!");
        var clientData = event.connection.data;
        var username = clientData.split(':')[1];
        if (this.subscribers.includes(username)) {
          this.deleteUser(username);
        } else {
          console.warn("OTHER USER'S CONNECTION CREATED!");
          var clientData = event.connection.data;
          var username = clientData.split(':')[1];
          if (this.subscribers.includes(username)) {
            this.deleteUser(username);
          } else {
            this.subscribers.push(username);
            this.subscribers.sort((a, b) =>
              a.localeCompare(b, 'en', { sensitivity: 'base' })
            );
          }
        }
      }
      console.warn(event.connection);
    });

    this.session.on('connectionDestroyed', (event: ConnectionEvent) => {
      if (
        event.connection.connectionId === this.session.connection.connectionId
      ) {
        console.warn('YOUR OWN CONNECTION DESTROYED!');
      } else {
        console.warn("OTHER USER'S CONNECTION DESTROYED!");
        this.subscribers = this.subscribers.filter(
          x => x !== event.connection.data.split(':')[1]
        );
      }
      console.warn(event.connection);
      // this if statement should check if the current user is the one publishing the stream
      if (this.authorizationHelper.isA()) {
        this.location.back();
      }
    });

    // 3) Connect to the session
    this.session
      .connect(this.token, 'CLIENT:' + this.user.username)
      .then(() => {
        if (this.authorizationHelper.isA() || this.authorizationHelper.isW()) {
          // 4) Get your own camera stream with the desired resolution and publish it, only if the user is supposed to do so
          this.publisher = this.OV.initPublisher(
            'publisher',
            this.cameraOptions
          );

          this.publisher.on('accessAllowed', () => {
            console.warn('CAMERA ACCESS ALLOWED!');
          });
          this.publisher.on('accessDenied', () => {
            console.warn('CAMERA ACCESS DENIED!');
          });
          this.publisher.on('streamCreated', (event: StreamEvent) => {
            console.warn('STREAM CREATED BY PUBLISHER!');
            console.warn(event.stream);
          });

          // 5) Publish your stream
          this.session.publish(this.publisher);
        }
      })
      .catch(error => {
        console.log(
          'There was an error connecting to the session:',
          error.code,
          error.message
        );
      });
  }

  private initStreamStuff() {
    if (this.authorizationHelper.isA() || this.authorizationHelper.isW()) {
      // If the user is an admin or worker: creates the session and gets a token (with PUBLISHER role)
      this.videoSessionService.createSession(this.stream.id).subscribe(
        () => {
          this.videoSessionService.generateToken(this.stream.id).subscribe(
            response => {
              this.token = response as string;
              console.warn('Token: ' + this.token);
              this.OPEN_VIDU_CONNECTION();
            },
            error => {
              console.error(error);
            }
          );
        },
        error => {
          console.error(error);
        }
      );
    } else {
      // If the user is a user: gets a token (with SUBSCRIBER role)
      this.videoSessionService.generateToken(this.stream.id).subscribe(
        response => {
          // {0: token}
          this.token = response as string;
          console.warn('Token: ' + this.token);
          this.OPEN_VIDU_CONNECTION();
        },
        error => {
          console.log(error);
          if (error.status === 409) {
            this.toastService.addSingle(
              'info',
              'Ainda não começou',
              'O stream selecionado ainda não começou'
            );
          }
        }
      );
    }

    // Specific aspects of this concrete application
    this.afterConnectionStuff();
    this.isLoading = false;
  }

  ngOnInit() {
    this.userContextService.user$.subscribe(user => (this.user = user));

    // Specific aspects of this concrete application
    this.previousConnectionStuff();

    const ref = this.dialogService.open(AudioSourcePickerComponent, {
      header: 'Escolher Áudio',
      width: '75%',
      height: '75%',
      closable: false,
      closeOnEscape: false,
    });

    ref.onClose.subscribe((audioSource: string) => {
      if (
        audioSource &&
        !audioSource.toString().includes('Permission denied')
      ) {
        this.cameraOptions.audioSource = audioSource;
        this.initStreamStuff();
      } else {
        this.toastService.addSingle(
          'error',
          'Necessita de uma fonte de áudio para passar a stream',
          'Esta janela vai-se fechar em 5 segundos'
        );
        setTimeout(() => window.close(), 5000);
      }
    });
  }

  ngOnDestroy() {
    this.deleteUser(this.user.username);

    if (this.OV) {
      this.session.disconnect();
    }
  }

  deleteUser(username) {
    this.videoSessionService.deleteUser(this.stream.id, username).subscribe(
      response => {
        console.warn(`${username} successfully left the stream`);
      },
      error => {
        console.log(error);
      }
    );
  }

  previousConnectionStuff() {
    this.stream = this.sessionService.getItem('current-stream') as Stream;
    this.titleService.setTitle(this.stream.title);
    this.cameraOptions = this.sessionService.getItem(
      'stream-options-' + this.stream.id
    ) as PublisherProperties;
  }

  afterConnectionStuff() {
    if (this.authorizationHelper.isA() || this.authorizationHelper.isW()) {
      this.localVideoActivated = this.cameraOptions.publishVideo !== false;
      this.localAudioActivated = this.cameraOptions.publishAudio !== false;
      this.videoIcon = this.localVideoActivated ? 'videocam' : 'videocam_off';
      this.audioIcon = this.localAudioActivated ? 'mic' : 'mic_off';
    }
    this.fullscreenIcon = 'fullscreen';
  }

  changeVideoPlay() {
    this.isVideoPlaying = !this.isVideoPlaying;
    this.publisher.publishVideo(this.isVideoPlaying);
  }

  changeAudioPlay() {
    this.isAudioPlaying = !this.isAudioPlaying;
    this.publisher.publishAudio(this.isAudioPlaying);
  }

  toggleSubscribers() {
    this.showSideBar = !this.showSideBar;
  }
}
