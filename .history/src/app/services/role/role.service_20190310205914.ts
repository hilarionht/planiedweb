import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { URL_SERVICIOS } from '../../config/config';
import { Page } from '../../models/Page';
import { Role } from '../../models/role.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class RoleService {

  role: Role;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _tstrService: ToasterService
  ) { }
  create( role: Role ): Observable<any> {
    const url = URL_SERVICIOS + '/role';
    // console.log(' create role: ',role);
    return this.http.post(url, role ,  { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)})
      .map((res: any) => {
        this._tstrService.pop('success', 'ALTA DE ROL', 'EL ROL FUE CREADO CON EXITO');
        return res;
      }).catch(
        (err: any) => {
          this._tstrService.pop('warning', 'Error al Crear', 'no se pudo guardar');
          // console.log(err.error , 'error att role.service.ts');
          // this.toastr.warning( err.errors.message , 'Error en generar la role!',{ timeOut: 3000,positionClass: 'toast-top-right'});
          return Observable.throw(err.error);
        }
        //this.handleError
      );
  }
  private handleError(error: Response | any) {
    console.error(error, 'erro: <<<' );
    return Observable.throw(error); // <= B
}
  update( role: Role ) {

    const url = URL_SERVICIOS + '/role';
    return this.http.put( url, role ,  { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)})
                .map( (resp: any) => {
                  this._tstrService.pop('success', 'MODIFICACION', 'ROL MODIFICADO CON EXITO!');
                  return resp;
                }).catch( (err: any) => {
                  this._tstrService.pop('error', 'MODIFICACION', 'no se pudo modificar el rol!');
                  return Observable.throw( err );
                });

  }

  get(id: string) {
    const url = URL_SERVICIOS + '/role/' + id;
    return this.http.get( url, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} );
  }

  delete( id: string ) {
    const url = URL_SERVICIOS + '/role/' + id;
    return this.http.delete( url ,  { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( resp => {
                  this._tstrService.pop('info', 'ELIMINAR', 'Rol eliminado con exito!');
                  return resp;
                }).catch( err => {
                  this._tstrService.pop('error', 'ELIMINAR', 'No se puede eliminar el rol');
                  return Observable.throw( err );
                });

  }

  list( desde: number = 0 ) {
    const url = URL_SERVICIOS + '/role'; // ?desde=' + desde;
    return this.http.get( url, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} );
  }
  Roles( page: Page ) { // word:  string
    console.log(page);
    const url = URL_SERVICIOS + '/role/?paginate={"limit":' + page.limit + ',"numberPage":' + page.numberPage + '}&isPaginate=true';
    return this.http.get( url, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} );
  }

}
