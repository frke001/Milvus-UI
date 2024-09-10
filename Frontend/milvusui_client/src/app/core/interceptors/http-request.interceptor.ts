import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { UiService } from '../services/ui.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  
  private uiService: UiService = inject(UiService);
  private requests: HttpRequest<any>[] = [];

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    
    this.uiService.enableLoader();
    this.requests.push(req);
    return new Observable((observer) => {
      const subscription = next
        .handle(req)
        .pipe(finalize(() => this.uiService.disableLoader()))
        .subscribe({
          next: (event) => {
            if (event instanceof HttpResponse) {
              observer.next(event);
              this.removeRequest(req);
            } else {
              //   this.removeRequest(request);
            }
          },
          error: (err) => {
            this.removeRequest(req);
            observer.error(err);
          },
          complete: () => {
            this.removeRequest(req);
            observer.complete();
          },
        });
      // remove request from queue when cancelled
      return () => {
        this.removeRequest(req);
        subscription.unsubscribe();
      };
    });
  }

  private removeRequest(req: HttpRequest<any>): void {
    const i = this.requests.indexOf(req);

    if (i < 0) return;

    this.requests.slice(i, 1);
  }
}
