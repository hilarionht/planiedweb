import { Injectable } from '@angular/core';
import { Person } from '../../models/person.model';
import { URL_SERVICIOS } from '../../config/config';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class PersonService {

  person: Person;
  constructor(
    public http: HttpClient,
    public router: Router
  ) { }
  create( person: Person ) {
    const url = URL_SERVICIOS + '/person/';
    return this.http.post(url, person ,  { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)})
      .map((resp: any) => {
        // this.toastr.success( person.firstname + ' ' + person.lasname , 'personaExitosa!',{ timeOut: 3000,positionClass: 'toast-top-right'});
        return resp;
      }).catch( err => {
        // console.log( err.error.message);
        // this.toastr.warning( 'Error en generar la person!',"ERROR AL GUARDAR PERSONA" ,{ timeOut: 3000,positionClass: 'toast-top-right'});
        return Observable.throw( err );
      });
  }
  update( person: Person ) {

    const url = URL_SERVICIOS + '/person';
    return this.http.put( url, person ,  { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( (resp: any) => {
                  // this.toastr.success( resp.nombre, 'person Actualizado!',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return true;
                });

  }

  get(id: string) {
    const url = URL_SERVICIOS + '/person/' + id;
    return this.http.get( url, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} )
                    .map(resp => resp);
  }
  getById(id: string) {
    let url = URL_SERVICIOS + '/person/' + id;
    url += `?filter={"relations":["person","person.locality", "person.locality.department","locality.department.province"]}`;
    return this.http.get( url, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} )
                    .map(resp => resp);
  }
  delete( id: string ) {
    const url = URL_SERVICIOS + '/person/' + id;
    return this.http.delete( url ,  { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( resp => {
                  // this.toastr.success( 'El person a sido eliminado correctamente', 'person BORRADO!',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return true;
                });

  }

  list( page: number = 0 , limit: number= 0, word: string= null, isPaginate: Boolean= true  ) {
    let url = URL_SERVICIOS + '/person/';
    url += `?paginate={"limit": ${ limit },"numberPage":${ page }}`;
    url += '&isPaginate=true';
    // console.log(url);

    return this.http.get( url, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} );
  }

}
