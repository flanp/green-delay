import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
/**
 * application state service
 */
export class ApplicationStateService {
  private isMobileResolution: boolean;

  constructor() {
    this.isMobileResolution = window.innerWidth <= 992;
  }

  /**
   * get is mobile resolution or desktop.
   * need to refresh after changing website resolution
   */
  public getIsMobileResolution(): boolean {
    return this.isMobileResolution;
  }
}
