import { Injectable, ViewContainerRef } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Province } from '../../models/province.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { URL_SERVICIOS } from '../../config/config';
//import { ToastsManager } from 'ng2-toastr';

@Injectable()
export class ProvinceService {

  
  constructor(
    public http: HttpClient, 
    public router: Router,
    private toastr: ToastrService
    //public toast: ToastsManager, 
    // vcr: ViewContainerRef
  ) {
   // this.toast.setRootViewContainerRef(vcr);
   }

  create( province: Province ) {
    let url = URL_SERVICIOS + '/province';
    return this.http.post(url, province ,  { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)})
      .map((res: any) => {
        this.toastr.success( 'Provincia ' + province.name  + " fue creado con exito!", "CREACION DE PROVINCIA" ,{ enableHtml:true, timeOut: 3000,positionClass: 'toast-top-right'});
        //this.toastr.success( 'Provincia ' + province.name  + " fue creado con exito!", "CREACION DE PROVINCIA" ,{ enableHtml:true, timeOut: 3000,positionClass: 'toast-top-right'});
        return res.province;
      }).catch( err => {
        console.log('in create', err.error.message);
        let errorcause = err.error.message;
        if(errorcause.indexOf("Ya existe la llave")){
          this.toastr.error( "NO SE PUEDE CREAR UN PROVINCIA CON EL NOMBRE: " + province.name.toUpperCase() + " YA EXISTENTE" , 'CREACION DE PROVINCIA',{ timeOut: 3000,positionClass: 'toast-top-right',closeButton:true});
        }else{
          this.toastr.error( "NO SE PUEDE CREAR UN PROVINCIA CON EL NOMBRE: " + province.name.toUpperCase() , 'CREACION DE PROVINCIA',{ timeOut: 3000,positionClass: 'toast-top-right'});
        }
        
        return Observable.throw( err );
      });
  }
  
  update( province: Province ) {

    let url = URL_SERVICIOS + '/province';
    
    return this.http.put( url, province ,  { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( (resp: any) => {
                  this.toastr.success( resp.nombre, 'province Actualizado!',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return true;
                });

  }
  
  get(id: string){
    let url = URL_SERVICIOS + '/province/' + id;
    return this.http.get( url, { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} )
                    .map(resp => resp);
  }

  delete( id: string ) {
    let url = URL_SERVICIOS + '/province/' + id;
    //url += '?token=' + this.token;
    return this.http.delete( url ,  { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( resp => {
                  this.toastr.success( 'La Provincia a sido eliminado correctamente', 'Provincia BORRADO!',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return true;
                }).catch( err => {
                  // console.log(err.error.message, 'error en backend');
                  this.toastr.warning( "NO SE PUEDE ELIMINAR EL REGISTRO CONSULTE CON SU ADMINSTRADOR!" , 'ELIMINACION DE PROVINCIA',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return Observable.throw( err );
                });

  }
  
  list( desde: number = 0 ) {
    let url = URL_SERVICIOS + '/province';//?desde=' + desde;
    return this.http.get( url, { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} );
  }

}
