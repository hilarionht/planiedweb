import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { finalize, delay, catchError } from 'rxjs/operators';
import { LoaderService } from '../services/service.index';
import { HttpHeaders } from '@angular/common/http';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(public loaderService: LoaderService, public toasterService: ToasterService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.show();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${ localStorage.getItem('token')}`
    });
//    new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`);
    const reqClone = req.clone({headers});
    return next.handle(reqClone).pipe(
      // delay(10),
      catchError(this.manejarError),
      finalize(() => this.loaderService.hide())
    );
  }
  manejarError(err: HttpErrorResponse) {
    console.warn(err);
    //this.toasterService.pop('warning', 'Error de Acceso', 'Ha ocurrido un error en el servicio');
    return throwError('Error de Servicio');
  }
}
