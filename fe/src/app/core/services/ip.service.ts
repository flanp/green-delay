import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IpService {
  constructor(private httpClient: HttpClient) {}

  getIp(): Observable<any> {
    return this.httpClient.get<any>('https://api.ipify.org/?format=json');
  }
}
