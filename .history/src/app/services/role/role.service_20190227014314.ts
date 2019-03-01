import { Injectable } from '@angular/core';
import { Role } from '../../models/role.model';
import { URL_SERVICIOS } from '../../config/config';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Page } from '../../models/Page';
import { ToasterService } from 'angular2-toaster';

@Injectable()
export class RoleService {

  role: Role;

  constructor(
    public http: HttpClient,
    public router: Router,
    public toasterService: ToasterService
  ) { }
  create( role: Role ) {
    const url = URL_SERVICIOS + '/role';
    // console.log(' create role: ',role);
    return this.http.post(url, role ,  { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)})
      .map((res: any) => {
        this.toasterService.pop('success', 'ALTA DE ROL', 'EL ROL FUE CREADO CON EXITO');
        /// this.toastr.success( "EL ROL " + role.name.toUpperCase() +" FUE CREADO CON EXITO!" , 'CREACION DE ROL',{ timeOut: 3000,positionClass: 'toast-top-right'});
        return res.role;
      }).catch( err => {
        console.log(err, 'error en backend');
        // this.toastr.warning( err.errors.message , 'Error en generar la role!',{ timeOut: 3000,positionClass: 'toast-top-right'});
        return Observable.throw( err );
      });
  }
  update( role: Role ) {

    const url = URL_SERVICIOS + '/role';
    console.log('role form: ', role);

    return this.http.put( url, role ,  { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( (resp: any) => {
                  console.log(resp, 'in put');

                  // this.toastr.success( "EL ROL " + resp.data.name.toUpperCase() + "FUE ACTUALIZADO CON EXITO!", 'ACTUALIZACION DE ROL',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return true;
                }).catch( err => {
                  // this.toastr.warning( "NO SE PUEDE ACTUALIZAR EL ROL!" , 'ACTUALIZACION DE ROL',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  console.log('error ', err);
                  return Observable.throw( err );
                });

  }

  get(id: string) {
    const url = URL_SERVICIOS + '/role/' + id;
    return this.http.get( url, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} );
                    // .map((resp:any) => {
                    //   return resp;
                    // });
  }

  delete( id: string ) {
    const url = URL_SERVICIOS + '/role/' + id;
    return this.http.delete( url ,  { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( resp => {
                  // this.toastr.success( 'El role a sido eliminado correctamente', 'ELIMINACION DE ROL',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return true;
                }).catch( err => {
                  // console.log(err.error.message, 'error en backend');
                  // this.toastr.warning( "NO SE PUEDE ELIMINAR EL ROL CONSULTE CON SU ADMINSTRADOR!" , 'ELIMINACION DE ROL',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return Observable.throw( err );
                });

  }

  list( desde: number = 0 ) {
    const url = URL_SERVICIOS + '/role'; // ?desde=' + desde;
    return this.http.get( url, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} );
  }
  Roles( page: Page ) { // word:  string
    const url = URL_SERVICIOS + '/role/?paginate={"limit":' + page.limit + ',"numberPage":' + page.numberPage + '}&isPaginate=true';
    return this.http.get( url, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} );
  }

}
