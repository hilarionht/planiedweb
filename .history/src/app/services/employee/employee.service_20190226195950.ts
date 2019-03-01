import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Employee } from '../../models/employee.model';
import { Observable } from 'rxjs';
import { Page } from '../../models/Page';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(
    public http: HttpClient, 
    public router: Router
  ) { }

  
  add( employee: Employee ) {
    let url = URL_SERVICIOS + '/employee';
    return this.http.post(url, employee ,  { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)})
      .map((resp: any) => {
        // this.toastr.success( 'Empleado  fue creado con exito!', "CREACION DE EMPLEADO" ,{ enableHtml:true, timeOut: 3000,positionClass: 'toast-top-right'});
        //this.toastr.success( 'Empleado ' + employee.name  + " fue creado con exito!", "CREACION DE EMPLEADO" ,{ enableHtml:true, timeOut: 3000,employeeClass: 'toast-top-right'});
        return resp;
      }).catch( err => {
        console.log('create', err.error.message);
        let errorcause = err.error.message;
        if(errorcause.indexOf("Ya existe la llave")){
          // this.toastr.error( "NO SE PUEDE CREAR UN EMPLEADO CON EL NOMBRE: " + employee+ " YA EXISTENTE" , 'CREACION DE EMPLEADO',{ timeOut: 3000, positionClass: 'toast-top-right',closeButton:true});
        }else{
          // this.toastr.error( "NO SE PUEDE CREAR UN EMPLEADO CON EL NOMBRE: " + employee, 'CREACION DE EMPLEADO',{ timeOut: 3000,positionClass: 'toast-top-right'});
        }
        
        return Observable.throw( err );
      });
  }
  
  update( employee: Employee ) {

    let url = URL_SERVICIOS + '/employee';
    
    return this.http.put( url, employee ,  { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( (resp: any) => {
                  // this.toastr.success( resp.nombre, 'employee Actualizado!',{ timeOut: 3000, positionClass: 'toast-top-right'});
                  return true;
                });

  }
  
  get(id: string){
    let url = URL_SERVICIOS + '/employee/' + id;
    return this.http.get( url, { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} )
                    .map(resp => resp);
  }

  delete( id: string ) {
    let url = URL_SERVICIOS + '/employee/' + id;
    //url += '?token=' + this.token;
    return this.http.delete( url ,  { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( resp => {
                  // this.toastr.success( 'La Empleado a sido eliminado correctamente', 'Empleado BORRADO!',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return true;
                }).catch( err => {
                  // this.toastr.warning( "NO SE PUEDE ELIMINAR EL REGISTRO CONSULTE CON SU ADMINSTRADOR!" , 'ELIMINACION DE EMPLEADO',{ timeOut: 3000, positionClass: 'toast-top-right'});
                  return Observable.throw( err );
                });

  }
  
  list( desde: number = 0 ) {
    //http://localhost:3030/api/employee/?isPaginate=true&filter={"relations":["person","person.locality","person.locality.department","person.locality.department.province","position","children","children.person"]}
    let url = URL_SERVICIOS + '/employee/?isPaginate=true';//?desde=' + desde;
    url += `&filter={"relations":["person","person.locality","person.locality.department","person.locality.department.province","job","children","children.person"]}`;
    url += `&paginate={"limit":10,"numberPage":1}`;
    return this.http.get( url, { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} );
  }
  employeeList( page: Page ) {
    let url  = URL_SERVICIOS + `/employee/?paginate={"limit":${ page.limit},"numberPage":${ page.numberPage }}&isPaginate=true`;
    url += `&filter={"relations":["person","person.locality","person.locality.department","person.locality.department.province","job"]}`;
    return this.http.get( url, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} );

    http://localhost:3030/api/employee/?paginate={"limit":100,"numberPage":1}&isPaginate=true&filter={"relations":["person","person.locality","person.locality.department","person.locality.department.province","job","children"]}
  }
}
