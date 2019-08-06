import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Employee } from '../../models/employee.model';
import { Observable } from 'rxjs';
import { Page } from '../../models/Page';
import { ToasterService } from 'angular2-toaster';
import { load } from '@angular/core/src/render3';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(
    public http: HttpClient,
    public router: Router,
    public toasterService: ToasterService
  ) { }


  add( employee: any ) {
    const url = URL_SERVICIOS + '/employee';
    // tslint:disable-next-line:max-line-length
    return this.http.post(url, employee , { headers: new HttpHeaders().append('Authorization', `Bearer ${ localStorage.getItem('token') }`)})
      .map((resp: any) => {
        this.toasterService.pop('success', 'GUARDAR EMPLEADO', 'Guardado con Exitos!');
        return resp;
      }).catch( err => {
        // console.log('create', err.error.message);
        const errorcause = err.error.message;
        this.toasterService.pop('warning', 'Error al Guardar', err.error.message);
        return Observable.throw( err );
      });
  }

  update( employee: any ) {

    const url = URL_SERVICIOS + '/employee';

    // tslint:disable-next-line:max-line-length
    return this.http.put( url, employee ,  { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( (resp: any) => {
                  this.toasterService.pop('info', 'EMPLEADO', 'modificado exitosamente!');
                  return resp;
                });

  }

  get(id: string) {
    const url = URL_SERVICIOS + '/employee/' + id;
    return this.http.get( url, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} )
                    .map(resp => resp);
  }
  getById(id: string) {
    let url = URL_SERVICIOS + '/employee/' + id;
    // tslint:disable-next-line:max-line-length
    url += `?filter={"relations":["person","person.locality", "person.locality.department","person.locality.department.province","phones"]}`;
    return this.http.get( url, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} )
                    .map(resp => resp);
  }
  delete( id: string ) {
    const url = URL_SERVICIOS + '/employee/' + id;
    // url += '?token=' + this.token;
    return this.http.delete( url ,  { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( resp => {
                  // this.toastr.success( 'La Empleado a sido eliminado correctamente', 'Empleado BORRADO!',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return resp;
                }).catch( err => {
                  // this.toastr.warning( "NO SE PUEDE ELIMINAR EL REGISTRO CONSULTE CON SU ADMINSTRADOR!" , 'ELIMINACION DE EMPLEADO',{ timeOut: 3000, positionClass: 'toast-top-right'});
                  return Observable.throw( err );
                });

  }

  list( page: Page ) {
    // tslint:disable-next-line:max-line-length
    let url  = URL_SERVICIOS + `/employee/?isPaginate=true&paginate={"limit":${ page.limit},"numberPage":${ page.numberPage }}`;
    if (page.prop) {
      // tslint:disable-next-line:max-line-length
      url += `&filter={"relations":["person","person.locality","person.locality.department","person.locality.department.province","job"],"order":{"${ page.prop }":"${ page.dir}"}}`;
    } else {
      url += `&filter={"relations":["person","person.locality","person.locality.department","person.locality.department.province","job"]}`;
    }
    // console.log(url);
    
    // ,"order":{"${ page.prop }":"${ page.dir}"}
    return this.http.get( url, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} );
  }// url += `?filter={"relations":["ambit","sector","region","locality", "locality.department","locality.department.province"]}`;
  employeeList( page: Page ) {
    let url  = URL_SERVICIOS + `/employee/?paginate={"limit":${ page.limit},"numberPage":${ page.numberPage }}&isPaginate=true`;
    url += `&filter={"relations":["person","person.locality","person.locality.department","person.locality.department.province","job"]}`;
    return this.http.get( url, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} );

    // http://localhost:3030/api/employee/?paginate={"limit":100,"numberPage":1}&isPaginate=true&filter={"relations":["person","person.locality","person.locality.department","person.locality.department.province","job","children"]}
  }
}
