import { RouteStateService } from 'src/app/core/services/route-state.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { AuthorizationHelper } from 'src/app/core/helpers/authorization.helper';
import { Stream } from '../stream.model';
import { StreamService } from '../stream.service';
import { streamCategoriesList } from 'src/app/core/enums/streamCategory.enum';
import { streamRatingsList } from 'src/app/core/enums/streamRating.enum';

@Component({
  selector: 'app-stream-registration',
  templateUrl: './stream-registration.component.html',
  styleUrls: ['./stream-registration.component.scss'],
})
export class StreamRegistrationComponent implements OnInit {
  streamForm: FormGroup;
  stream: Stream = new Stream();
  streamCategories = streamCategoriesList;
  streamRatings = streamRatingsList.filter(x => x.value != null);

  constructor(
    private formBuilder: FormBuilder,
    private streamService: StreamService,
    private toastService: ToastService,
    private routeStateService: RouteStateService,
    public authorizationHelper: AuthorizationHelper
  ) {}

  ngOnInit() {
    this.streamForm = this.formBuilder.group({
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      category: [this.streamCategories[0], Validators.required],
      rating: [this.streamRatings[0], Validators.required],
    });
  }

  confirmStreamChanges() {
    this.stream.title = this.streamForm.controls.title.value;
    this.stream.startDate = this.streamForm.controls.startDate.value;
    this.stream.category = this.streamForm.controls.category.value.value;

    this.stream.rating = this.streamForm.controls.rating.value.value;

    this.streamService
      .addStream(this.stream)
      .subscribe(_ => {
        this.toastService.addSingle('success', '', 'Stream criada com sucesso');
        this.routeStateService.add(
          'Stream',
          '/backoffice/stream',
          null,
          true
        );
      });
  }
}
