import { Injectable } from '@angular/core';

import { URL_SERVICIOS } from '../../config/config';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';
import { Locality } from '../../models/locality.model';
@Injectable()
export class LocalityService {

  constructor(
    public http: HttpClient, 
    public router: Router,
    private toastr: ToastrService
  ) { }
  create( locality: Locality ) {
    let url = URL_SERVICIOS + '/locality';
    return this.http.post(url, locality ,  { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)})
      .map((res: any) => {
        this.toastr.success("LOCALIAD CREADA CON EXITO!\n" +  locality.name, "Creacion de Localidad" , { enableHtml:true, timeOut: 3000, positionClass: 'toast-top-right'});
        return res.locality;
      }).catch( err => {
        this.toastr.warning('Error en generar la localidad!', "Creacion de Localidad" , { timeOut: 3000,positionClass: 'toast-top-right'});
        return Observable.throw( err );
      });;
  }
  update( locality: Locality ) {

    let url = URL_SERVICIOS + '/locality';
    
    return this.http.put( url, locality ,  { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( (resp: any) => {
                  this.toastr.success( resp.nombre, 'locality Actualizado!',{ timeOut: 3000, positionClass: 'toast-top-right' });
                  return true;
                });

  }
  
  get(id: string){
    let url = URL_SERVICIOS + '/locality/' + id;
    return this.http.get( url, { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} )
                    .map(resp => resp);
  }

  delete( id: string ) {
    let url = URL_SERVICIOS + '/locality/' + id;
    return this.http.delete( url ,  { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( resp => {
                  this.toastr.success( 'El locality a sido eliminado correctamente', 'locality BORRADO!',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return true;
                }).catch( err => {
                  // console.log(err.error.message, 'error en backend');
                  this.toastr.warning( "NO SE PUEDE ELIMINAR EL REGISTRO CONSULTE CON SU ADMINSTRADOR!" , 'ELIMINACION DE LOCALIDAD',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return Observable.throw( err );
                });

  }
  
  list( desde: number = 0 ) {
    let url = URL_SERVICIOS + '/locality';//?desde=' + desde;
    return this.http.get( url, { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} );
  }
  listbyDepartment( id: string ) {
    let url = URL_SERVICIOS + '/department/';//?desde=' + desde;
    url+= `?filter={"where":{"id":${ id }},"relations":["localities"]}`;
    return this.http.get( url, { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} );
  }
}
