import { Component } from '@angular/core';
import { AuthorizationHelper } from '../../../core/helpers/authorization.helper';

@Component({
  selector: 'app-stream-list',
  templateUrl: './stream-list.component.html',
  styleUrls: ['./stream-list.component.scss'],
})
export class StreamListComponent {

  constructor(public authorizationHelper: AuthorizationHelper) {}
}
