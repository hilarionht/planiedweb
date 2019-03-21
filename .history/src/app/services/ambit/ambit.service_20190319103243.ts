import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Ambit } from '../../models/ambit.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Observable } from 'rxjs';
import { Page } from '../../models/Page';
import { ToasterService } from 'angular2-toaster';

@Injectable({
  providedIn: 'root'
})
export class AmbitService {
  ambit: Ambit;
  constructor(
    public http: HttpClient,
    public router: Router,
    public toasterService: ToasterService
  ) { }
  create( ambit: Ambit ) {
    const url = URL_SERVICIOS + '/ambit';
    return this.http.post(url, ambit ,  { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)})
      .map((res: any) => {
        this.toasterService.pop('success', 'Guardar ámbito', 'Guardado Exitosamente');
        return res.ambit;
      }).catch( err => {
       this.toasterService.pop('warning', 'Error al Guardar Ámbito', err.error.message);
        return Observable.throw( err );
      });
  }
  update( ambit: Ambit ) {

    const url = URL_SERVICIOS + '/ambit';
    // tslint:disable-next-line:max-line-length
    return this.http.put( url, ambit ,  { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( (resp: any) => {
                  this.toasterService.pop('info', 'Actualizacion Ámbito', 'actualizado exitosamente');
                  return true;
                });
  }

  get(id: string) {
    const url = URL_SERVICIOS + '/ambit/' + id;
    return this.http.get( url, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} )
                    .map(resp => resp);
  }

  delete( id: string ) {
    const url = URL_SERVICIOS + '/ambit/' + id;
    return this.http.delete( url ,  { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( resp => {
                  this.toasterService.pop('info', 'Eliminacion de ámbito', 'Se ha eliminado correctamente!');
                  return true;
                });

  }
  list( page: Page ) {
    const url = URL_SERVICIOS + `/ambit/?paginate={"limit": ${ page.limit } ,"numberPage": ${  page.numberPage } }&isPaginate=true`;
    return this.http.get( url, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} );
  }
}
