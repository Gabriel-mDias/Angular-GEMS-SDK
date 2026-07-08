/*
 * Public API — @gems/angular-sdk/http
 *
 * Abstrações HTTP para comunicação com APIs REST.
 */

export { GemsBaseStore, GemsHttpRequestOptions } from '../lib/http/gems-base-store';
export { GEMS_API_URL } from '../lib/http/gems-api-url.token';
export { provideGemsHttp } from '../lib/http/gems-http.provider';
export { GemsPageable } from '../lib/http/gems-pageable';
export { gemsLoadingInterceptor } from '../lib/http/interceptors/gems-loading.interceptor';
