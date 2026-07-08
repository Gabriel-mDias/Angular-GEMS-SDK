import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GemsPageable } from './gems-pageable';
import { GEMS_API_URL } from './gems-api-url.token';

export interface GemsHttpRequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?:
    | HttpParams
    | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
  pageable?: GemsPageable;
}

/**
 * Classe base para stores que consomem uma API REST.
 *
 * A autenticação (token JWT) NÃO é responsabilidade desta classe — use o
 * `gemsKeycloakInterceptor` do entry point `@gabriel-mdias/angular-gems-sdk/auth`
 * (ou o interceptor de bearer do keycloak-angular) para anexar `Authorization`.
 */
export abstract class GemsBaseStore {
  protected readonly http = inject(HttpClient);
  protected readonly baseUrl = inject(GEMS_API_URL);
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

  private prepareOptions(options?: GemsHttpRequestOptions): {
    headers: HttpHeaders;
    params?: HttpParams;
  } {
    const headers =
      options?.headers instanceof HttpHeaders
        ? options.headers
        : new HttpHeaders(options?.headers || {});

    let params =
      options?.params instanceof HttpParams
        ? options.params
        : new HttpParams({ fromObject: options?.params ?? {} });

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

  protected get<TResponse>(
    endpoint: string = '',
    options?: GemsHttpRequestOptions,
  ): Observable<TResponse> {
    return this.http.get<TResponse>(this.buildUrl(endpoint), this.prepareOptions(options));
  }

  protected post<TResponse, TBody = unknown>(
    endpoint: string = '',
    body: TBody,
    options?: GemsHttpRequestOptions,
  ): Observable<TResponse> {
    return this.http.post<TResponse>(this.buildUrl(endpoint), body, this.prepareOptions(options));
  }

  protected put<TResponse, TBody = unknown>(
    endpoint: string = '',
    body: TBody,
    options?: GemsHttpRequestOptions,
  ): Observable<TResponse> {
    return this.http.put<TResponse>(this.buildUrl(endpoint), body, this.prepareOptions(options));
  }

  protected delete<TResponse>(
    endpoint: string = '',
    options?: GemsHttpRequestOptions,
  ): Observable<TResponse> {
    return this.http.delete<TResponse>(this.buildUrl(endpoint), this.prepareOptions(options));
  }

  protected patch<TResponse, TBody = unknown>(
    endpoint: string = '',
    body: TBody,
    options?: GemsHttpRequestOptions,
  ): Observable<TResponse> {
    return this.http.patch<TResponse>(this.buildUrl(endpoint), body, this.prepareOptions(options));
  }
}
