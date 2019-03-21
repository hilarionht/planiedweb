import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Page } from '../../models/Page';
import { Institution } from '../../models/institution.model';
import { ToasterService } from 'angular2-toaster';

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {

  constructor(
    public http: HttpClient,
    public router: Router,
    public toasterService: ToasterService
  ) { }
  create( institution: Institution ) {
    const url = URL_SERVICIOS + '/institution';
    // tslint:disable-next-line:max-line-length
    return this.http.post(url, institution, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)})
      .map((res: any) => {
        this.toasterService.pop('success', 'Guardar Posicion', 'Guardado con Exitosamente');
        return res.institution;
      }).catch( err => {
        this.toasterService.pop('warning', 'Error al Guardar', err.error.message);
        return Observable.throw( err );
      });
  }
  update( institution: Institution ) {
    const url = URL_SERVICIOS + '/institution';
    // tslint:disable-next-line:max-line-length
    return this.http.put( url, institution ,  { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( (resp: any) => {
                  this.toasterService.pop('info', 'Modificacion de Posicion', 'modificado exitosamente!');
                  return true;
                });
  }

  get(id: string) {
    const url = URL_SERVICIOS + '/institution/' + id;
    return this.http.get( url, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} )
                    .map(resp => resp);
  }

  delete( id: string ) {
    const url = URL_SERVICIOS + '/institution/' + id;
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
    const url = URL_SERVICIOS + '/institution/'; // ?desde=' + desde;
    // url += `?filter={"where":{"id":${ id }}}`;
    return this.http.get( url, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} );
  }

}
