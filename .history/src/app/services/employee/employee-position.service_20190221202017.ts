import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { URL_SERVICIOS } from '../../config/config';
import { Employee } from '../../models/employee.model';
import { Observable } from 'rxjs';

@Injectable()
export class EmployeePositionService {

  constructor(
    public http: HttpClient, 
    public router: Router,
    private toastr: ToastrService
  ) { }
  
  add( position: Employee ) {
    let url = URL_SERVICIOS + '/position';
    return this.http.post(url, position ,  { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)})
      .map((resp: any) => {
        this.toastr.success( 'Empleado ' + position  + " fue creado con exito!", "CREACION DE EMPLEADO" ,{ enableHtml:true, timeOut: 3000,positionClass: 'toast-top-right'});
        //this.toastr.success( 'Empleado ' + position.name  + " fue creado con exito!", "CREACION DE EMPLEADO" ,{ enableHtml:true, timeOut: 3000,positionClass: 'toast-top-right'});
        return resp;
      }).catch( err => {
        console.log('in create', err.error.message);
        let errorcause = err.error.message;
        if(errorcause.indexOf("Ya existe la llave")){
          this.toastr.error( "NO SE PUEDE CREAR UN EMPLEADO CON EL NOMBRE: " + position+ " YA EXISTENTE" , 'CREACION DE EMPLEADO',{ timeOut: 3000,positionClass: 'toast-top-right',closeButton:true});
        }else{
          this.toastr.error( "NO SE PUEDE CREAR UN EMPLEADO CON EL NOMBRE: " + position, 'CREACION DE EMPLEADO',{ timeOut: 3000,positionClass: 'toast-top-right'});
        }
        
        return Observable.throw( err );
      });
  }
  
  update( position: Employee ) {

    let url = URL_SERVICIOS + '/position';
    
    return this.http.put( url, position ,  { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( (resp: any) => {
                  this.toastr.success( resp.nombre, 'position Actualizado!',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return true;
                });

  }
  
  get(id: string){
    let url = URL_SERVICIOS + '/position/' + id;
    return this.http.get( url, { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} )
                    .map(resp => resp);
  }

  delete( id: string ) {
    let url = URL_SERVICIOS + '/position/' + id;
    //url += '?token=' + this.token;
    return this.http.delete( url ,  { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( resp => {
                  this.toastr.success( 'La Empleado a sido eliminado correctamente', 'Empleado BORRADO!',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return true;
                }).catch( err => {
                  // console.log(err.error.message, 'error en backend');
                  this.toastr.warning( "NO SE PUEDE ELIMINAR EL REGISTRO CONSULTE CON SU ADMINSTRADOR!" , 'ELIMINACION DE EMPLEADO',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return Observable.throw( err );
                });

  }
  
  list( desde: number = 0 ) {
    let url = URL_SERVICIOS + '/position';//?desde=' + desde;
    return this.http.get( url, { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} );
  }
}
