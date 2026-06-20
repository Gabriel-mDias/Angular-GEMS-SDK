import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, from, switchMap } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { GemsPageable } from './gems-pageable';
import { GEMS_API_URL } from './gems-api-url.token';

export interface GemsHttpRequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
  pageable?: GemsPageable;
}

export abstract class GemsBaseStore {
  protected readonly http = inject(HttpClient);
  protected readonly baseUrl = inject(GEMS_API_URL);
  protected readonly keycloakService = inject(KeycloakService, { optional: true });
  protected readonly controllerPath: string;

  constructor(controllerPath: string) {
    this.controllerPath = controllerPath;
  }

  private buildUrl(endpoint: string): string {
    const base = this.baseUrl.replace(/\/$/, '');
    const controller = this.controllerPath.replace(/^\//, '').replace(/\/$/, '');
    const path = endpoint.replace(/^\//, '');

    const urlParts = [base];
    if (controller) urlParts.push(controller);
    if (path) urlParts.push(path);

    return urlParts.join('/');
  }

  private async prepareOptions(options?: GemsHttpRequestOptions): Promise<{ headers: HttpHeaders, params?: HttpParams }> {
    let headers = options?.headers instanceof HttpHeaders
      ? options.headers
      : new HttpHeaders(options?.headers || {});

    if (this.keycloakService && await this.keycloakService.isLoggedIn()) {
      await this.keycloakService.updateToken(30);
      const token = await this.keycloakService.getToken();

      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    let params = options?.params instanceof HttpParams
      ? options.params
      : new HttpParams({ fromObject: (options?.params as any) || {} });

    if (options?.pageable) {
      if (options.pageable.page !== undefined) {
        params = params.set('page', options.pageable.page.toString());
      }
      if (options.pageable.size !== undefined) {
        params = params.set('size', options.pageable.size.toString());
      }
      if (options.pageable.sort && options.pageable.sort.length > 0) {
        options.pageable.sort.forEach(s => {
          params = params.append('sort', s);
        });
      }
    }

    return { headers, params: params.keys().length > 0 ? params : undefined };
  }

  protected get<TResponse>(endpoint: string = '', options?: GemsHttpRequestOptions): Observable<TResponse> {
    return from(this.prepareOptions(options)).pipe(
      switchMap(reqOptions => this.http.get<TResponse>(this.buildUrl(endpoint), reqOptions))
    );
  }

  protected post<TResponse, TBody = unknown>(endpoint: string = '', body: TBody, options?: GemsHttpRequestOptions): Observable<TResponse> {
    return from(this.prepareOptions(options)).pipe(
      switchMap(reqOptions => this.http.post<TResponse>(this.buildUrl(endpoint), body, reqOptions))
    );
  }

  protected put<TResponse, TBody = unknown>(endpoint: string = '', body: TBody, options?: GemsHttpRequestOptions): Observable<TResponse> {
    return from(this.prepareOptions(options)).pipe(
      switchMap(reqOptions => this.http.put<TResponse>(this.buildUrl(endpoint), body, reqOptions))
    );
  }

  protected delete<TResponse>(endpoint: string = '', options?: GemsHttpRequestOptions): Observable<TResponse> {
    return from(this.prepareOptions(options)).pipe(
      switchMap(reqOptions => this.http.delete<TResponse>(this.buildUrl(endpoint), reqOptions))
    );
  }

  protected patch<TResponse, TBody = unknown>(endpoint: string = '', body: TBody, options?: GemsHttpRequestOptions): Observable<TResponse> {
    return from(this.prepareOptions(options)).pipe(
      switchMap(reqOptions => this.http.patch<TResponse>(this.buildUrl(endpoint), body, reqOptions))
    );
  }
}
