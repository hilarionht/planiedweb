import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Page } from '../../models/Page';
import { Job } from '../../models/job.model';
import { ToasterService } from 'angular2-toaster';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(
    public http: HttpClient,
    public router: Router,
    public toasterService: ToasterService
  ) { }
  create( job: Job ) {
    const url = URL_SERVICIOS + '/job';
    return this.http.post(url, job ,  { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)})
      .map((res: any) => {
        this.toasterService.pop('success', 'Guardar Posicion', 'Guardado con Exitosamente');
        return res.job;
      }).catch( err => {
        this.toasterService.pop('warning', 'Error al Guardar', err.error.message);
        return Observable.throw( err );
      });
  }
  update( job: Job ) {
    const url = URL_SERVICIOS + '/job';
    return this.http.put( url, job ,  { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( (resp: any) => {
                  this.toasterService.pop('info', 'Modificacion de Posicion', 'modificado exitosamente!');
                  return true;
                });
  }

  get(id: string) {
    const url = URL_SERVICIOS + '/job/' + id;
    return this.http.get( url, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} )
                    .map(resp => resp);
  }

  delete( id: string ) {
    const url = URL_SERVICIOS + '/job/' + id;
    return this.http.delete( url ,  { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( resp => {
                  this.toasterService.pop('success', 'Guardar Posicion', 'Guardado con Exitosamente');
                  return true;
                }).catch( err => {
                  this.toasterService.pop('warning', 'Error al Guardar Posición', err.error.message);
                  return Observable.throw( err );
                });

  }
  list( page?: Page, id?: string ) {
    const url = URL_SERVICIOS + '/job/'; // ?desde=' + desde;
    // url += `?filter={"where":{"id":${ id }}}`;
    return this.http.get( url, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} );
  }

}
