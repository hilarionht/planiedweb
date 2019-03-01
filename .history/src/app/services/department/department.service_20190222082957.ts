import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { URL_SERVICIOS } from '../../config/config';

import { Department } from './../../models/departament.model';


@Injectable()
export class DepartmentService {

  departament:Department;
  constructor(
    public http: HttpClient, 
    public router: Router
  ) { }
  
  create( department: Department ) {
    let url = URL_SERVICIOS + '/department';
    return this.http.post(url, department ,  { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)})
      .map((res: any) => {
        this.toastr.success( department.name , 'departmento Exitosa!',{ timeOut: 3000,positionClass: 'toast-top-right'});
        return res.department;
      }).catch( err => {
        let errorcause = err.error.message;
        if(errorcause.indexOf("Ya existe la llave")){
          // this.toastr.warning( "NO SE PUEDE CREAR DEPARTAMENTO CON EL NOMBRE: " + department.name.toUpperCase() +" YA EXISTENTE" , 'CREACION DE DEPARTAMENTO',{ timeOut: 3000,positionClass: 'toast-top-right'});
        }
        else{
          // this.toastr.warning( "NO SE PUEDE CREAR DEPARTAMENTO CON EL NOMBRE: " + department.name.toUpperCase() , 'CREACION DE DEPARTAMENTO',{ timeOut: 3000,positionClass: 'toast-top-right'});
        }
        return Observable.throw( err );
      });
  }
  update( department: Department ) {

    let url = URL_SERVICIOS + '/department';
    
    return this.http.put( url, department ,  { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( (resp: any) => {
                  // this.toastr.success( resp.nombre, 'departmento Actualizado!',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return true;
                }).catch( err => {
                  // console.log(err.error.message);
                 //  this.toastr.warning( "NO SE PUEDE ACTUALIZAR DEPARTAMENTO CON EL NOMBRE: " + department.name.toUpperCase() , 'ACTUALIZACION DE DEPARTAMENTO',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return Observable.throw( err );
                });

  }
  
  get(id: string){
    let url = URL_SERVICIOS + '/department/' + id;
    return this.http.get( url, { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} )
                    .map(resp => resp);
  }

  delete( id: string ) {
    let url = URL_SERVICIOS + '/department/' + id;
    //url += '?token=' + this.token;
    return this.http.delete( url ,  { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( (resp:any) => {
                  this.toastr.success( 'El departmento a sido eliminado correctamente', 'departmento BORRADO!',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return resp.success;
                }).catch( err => {
                  // console.log(err.error.message, 'error en backend');
                  this.toastr.error( "NO SE PUEDE ELIMINAR EL REGISTRO CONSULTE CON SU ADMINSTRADOR!" , 'ELIMINACION DE DEPARTAMENTO',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return Observable.throw( err );
                });

  }
  
  list( desde: number = 0 ) {
    let url = URL_SERVICIOS + '/department';//?desde=' + desde;
    return this.http.get( url, { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} );
  }
  listbyProvince( id: string ) {
    
    let url = URL_SERVICIOS + '/province/';//?desde=' + desde;
    url+= `?filter={"where":{"id":${ id }},"relations":["departments"]}`;
    return this.http.get( url, { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} );
  }
}
