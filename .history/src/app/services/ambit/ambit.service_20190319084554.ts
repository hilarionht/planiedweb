import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Ambit } from '../../models/ambit.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Observable } from 'rxjs';
import { Page } from '../../models/Page';

@Injectable({
  providedIn: 'root'
})
export class AmbitService {

  
  ambit:Ambit;

  constructor(
    public http: HttpClient, 
    public router: Router
  ) { }
  create( ambit: Ambit ) {
    let url = URL_SERVICIOS + '/ambit';
    console.log(' create ambit: ',ambit);
    return this.http.post(url, ambit ,  { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)})
      .map((res: any) => {
        // this.toastr.success( ambit.name , 'ambit Exitosa!',{ timeOut: 3000,positionClass: 'toast-top-right'});
        return res.ambit;
      }).catch( err => {
        console.log(err, 'error en backend');
        // this.toastr.warning( err.error.errors.message , 'Error en generar la ambit!',{ timeOut: 3000,positionClass: 'toast-top-right'});
        return Observable.throw( err );
      });;
  }
  update( ambit: Ambit ) {

    let url = URL_SERVICIOS + '/ambit';
    console.log(url);
    
    return this.http.put( url, ambit ,  { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( (resp: any) => {
                  // this.toastr.success( resp.nombre, 'ambit Actualizado!',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return true;
                });

  }
  
  get(id: string){
    let url = URL_SERVICIOS + '/ambit/' + id;
    return this.http.get( url, { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} )
                    .map(resp => resp);
  }

  delete( id: string ) {
    let url = URL_SERVICIOS + '/ambit/' + id;
    //url += '?token=' + this.token;
    return this.http.delete( url ,  { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( resp => {
                  // this.toastr.success( 'El ambit a sido eliminado correctamente', 'ambit BORRADO!',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return true;
                });

  }
  list( page: Page ) {
    const url = URL_SERVICIOS + `/ambit/?paginate={"limit": ${ page.limit } ,"numberPage": ${  page.numberPage } }&isPaginate=true`;
    return this.http.get( url, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} );
  }
}
