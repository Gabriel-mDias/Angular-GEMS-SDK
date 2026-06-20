import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { GemsLoadingService } from '../../services/gems-loading.service';

/**
 * Interceptor HTTP que exibe automaticamente o Loading Full-page do SDK
 * para todas as requisições.
 * Pode ser configurado nos providers da aplicação usando:
 * provideHttpClient(withInterceptors([gemsLoadingInterceptor]))
 */
export const gemsLoadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const loadingService = inject(GemsLoadingService);

  loadingService.show();

  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
