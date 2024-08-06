import { environment } from 'src/environments/environment';
import { Injectable, Inject } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { Router } from '@angular/router';
import {
  HttpHeaders,
  HttpErrorResponse,
  HttpResponse,
  HttpClient,
} from '@angular/common/http';
import { mergeMap, catchError, finalize, concatMap, tap } from 'rxjs/operators';
import { SessionService } from './session.service';
import { ToastService } from './toast.service';

@Injectable()
export class ServerBaseService {
  private apiUrl = environment.apiUrl;
  private authTokenRelativePath = 'user/authenticate';
  private refreshTokenRelativePath = 'user/refresh-token';

  constructor(
    protected router: Router,
    protected httpClient: HttpClient,
    private sessionService: SessionService,
    private toastService: ToastService
  ) {
    this.apiUrl = this.apiUrl.endsWith('/') ? this.apiUrl : this.apiUrl + '/';
  }

  public get<T>(
    path: string,
    data?: any,
    headers?: HttpHeaders,
    useLoadScope = true,
    authenticated = true
  ): Observable<T> {
    if (data) {
      path = this.BuildQueryString(path, data);
    }
    return this.sendRequest<T>(
      path,
      'GET',
      null,
      authenticated,
      useLoadScope,
      headers
    );
  }

  public post<T>(
    path: string,
    data: any,
    headers?: HttpHeaders,
    useLoadScope = true,
    authenticated = true
  ): Observable<T> {
    return this.sendRequest<T>(
      path,
      'POST',
      data,
      authenticated,
      useLoadScope,
      headers
    );
  }

  public put<T>(
    path: string,
    data: any,
    headers?: HttpHeaders,
    useLoadScope = true,
    authenticated = true
  ): Observable<T> {
    return this.sendRequest<T>(
      path,
      'PUT',
      data,
      authenticated,
      useLoadScope,
      headers
    );
  }

  public patch<T>(
    path: string,
    data: any,
    headers?: HttpHeaders,
    useLoadScope = true,
    authenticated = true
  ): Observable<T> {
    return this.sendRequest<T>(
      path,
      'PATCH',
      data,
      authenticated,
      useLoadScope,
      headers
    );
  }

  public delete<T>(
    path: string,
    data?: any,
    headers?: HttpHeaders,
    useLoadScope = true,
    authenticated = true
  ): Observable<T> {
    return this.sendRequest<T>(
      path,
      'DELETE',
      data,
      authenticated,
      useLoadScope,
      headers
    );
  }

  public getAuthToken<T>(username: string, password: string): Observable<T> {
    return this.sendRequest<T>(
      this.authTokenRelativePath,
      'POST',
      { username, password },
      false
    );
  }

  public refreshAuthToken<T>(useLoadScope = true): Observable<T> {
    const refreshToken = encodeURIComponent(
      this.sessionService.getItem('refreshToken')
    );

    return this.sendRequest<T>(
      this.refreshTokenRelativePath,
      'POST',
      { refreshToken },
      false,
      useLoadScope
    );
  }

  public sendRequest<T>(
    path: string,
    method: string,
    data?: any,
    authenticated: boolean = false,
    useLoadScope: boolean = true,
    extraHeaders?: HttpHeaders,
    type: 'arraybuffer' | 'blob' | 'json' | 'text' = 'json',
    observe: 'response' | 'body' = 'body'
  ): Observable<any> {
    const url = this.apiUrl + path;
    let headers = extraHeaders;
    if (headers == null) {
      headers = new HttpHeaders();
    }
    if (!headers.has('Content-Type') && !(data instanceof FormData)) {
      headers = headers.append('Content-Type', 'application/json');
    }
    // Construct headers
    if (authenticated) {
      headers = headers.append(
        'Authorization',
        'Bearer ' + this.sessionService.getItem('accessToken')
      );
    }

    let options;
    switch (type) {
      case 'json':
        options = {
          body: data,
          headers,
          responseType: 'json',
        };
        break;
      case 'blob':
        options = {
          body: data,
          headers,
          responseType: 'blob',
        };
        break;
      case 'arraybuffer':
        options = {
          body: data,
          headers,
          responseType: 'blob',
        };
        break;
      case 'text':
        options = {
          body: data,
          headers,
          responseType: 'blob',
        };
    }

    options.observe = observe;

    return this.httpClient.request<T>(method, url, options).pipe(
      catchError((error: HttpErrorResponse) => {
        if (authenticated && error.status === 401) {
          return this.refreshAuthToken<any>() // try to refresh auth token
            .pipe(
              mergeMap(accessToken => {
                this.sessionService.setItem('accessToken', accessToken.token);
                options.headers = headers.set(
                  'Authorization',
                  'Bearer ' + this.sessionService.getItem('accessToken')
                );
                return this.httpClient.request<T>(method, url, options); // try again
              }),
              catchError((errorRefresh: HttpErrorResponse) => {
                if (
                  errorRefresh.status === 401 ||
                  (errorRefresh.status === 400 && errorRefresh.error)
                ) {
                  this.sessionService.clear();
                  this.router.navigate(['']);
                  this.toastService.addSingle(
                    'error',
                    '',
                    'A sua sessão expirou'
                  );
                }
                return of().pipe(
                  tap(() => this.handleHttpError(errorRefresh)),
                  concatMap(() => throwError(errorRefresh))
                );
              })
            );
        } else {
          this.handleHttpError(error);
          return throwError(error);
        }
      })
    );
  }

  protected BuildQueryString(baseUrl: string, parameters): string {
    return `${baseUrl}?${this.BuildParametersFromSearch(parameters)}`;
  }

  protected BuildParametersFromSearch<T>(obj: T): string {
    const queryStr = '';
    if (obj == null) {
      return queryStr;
    }
    return this.PopulateSearchParams(queryStr, '', obj);
  }

  protected PopulateSearchParams(
    queryStr: string,
    key: string,
    value: any
  ): string {
    if (value == null || value === 'null' || value === 'undefined') {
      return queryStr;
    }
    if (value instanceof Array) {
      queryStr = this.PopulateArray(queryStr, key, value);
    } else if (
      value instanceof Date ||
      typeof value.toISOString === 'function'
    ) {
      queryStr +=
        (queryStr === '' ? '' : '&') +
        `${key}=${encodeURIComponent(value.toISOString())}`;
    } else if (value instanceof Object) {
      queryStr = this.PopulateObject(queryStr, key, value);
    } else if (typeof value !== 'string' || value !== '') {
      queryStr +=
        (queryStr === '' ? '' : '&') +
        `${key}=${encodeURIComponent(value as string)}`;
    }
    return queryStr;
  }

  protected PopulateObject<T>(
    queryStr: string,
    prefix: string,
    val: T
  ): string {
    const objectKeys = Object.keys(val) as Array<keyof T>;

    if (prefix) {
      prefix = prefix + '.';
    }
    for (const objKey of objectKeys) {
      const value = val[objKey];
      const key = prefix + objKey;

      queryStr = this.PopulateSearchParams(queryStr, key, value);
    }
    return queryStr;
  }

  protected PopulateArray<T>(
    queryStr: string,
    prefix: string,
    val: Array<T>
  ): string {
    const key = prefix;
    for (const index of Object.keys(val)) {
      const value: any = val[index];
      queryStr = this.PopulateSearchParams(queryStr, key, value);
    }
    return queryStr;
  }

  protected handleHttpError(data: HttpErrorResponse): void {
    if (data) {
      if (data.status === 409 && data.error != null) {
        this.toastService.addSingle('error', '', data.error.message);
        return;
      } else if (data.status === 403) {
        this.toastService.addSingle('error', '', data.error.message);
        return;
      } else if (data.status === 500) {
        this.toastService.addSingle('error', '', 'Erro inesperado');
        return;
      } else if (data.status === 400) {
        const body = data.error;
        if (
          body != null &&
          body.errors != null &&
          body.errors instanceof Array
        ) {
          this.toastService.addSingle('error', '', body.errors[0].msg);
          return;
        }
      } else if (data.status === 404) {
        const body = data.error;
        if (
          body != null &&
          body.errors != null &&
          body.errors instanceof Array
        ) {
          body.errors.forEach(arrayError => {
            if (arrayError.errors != null) {
              arrayError.errors.forEach((error: string) =>
                this.toastService.addSingle('warning', '', error)
              );
            }
          });
          return;
        } else {
          this.toastService.addSingle('error', '', 'Endpoint inválido');
          return;
        }
      } else if (data.status === 401) {
        return;
      }
    }
    this.toastService.addSingle('error', '', 'Erro inesperado');
  }
}
