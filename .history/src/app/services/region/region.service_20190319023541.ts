import { Region } from './../../models/region.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { URL_SERVICIOS } from '../../config/config';
import { Observable } from 'rxjs';
import { Page } from 'src/app/models/Page';


@Injectable()
export class RegionService {

  region:Region;

  constructor(
    public http: HttpClient, 
    public router: Router
  ) { }

  create( region: Region ) {
    let url = URL_SERVICIOS + '/region';
    return this.http.post(url, region ,  { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)})
      .map((res: any) => {
        //this.toastr.success( 'Region ' + region.name  + " fue creado con exito!", "CREACION DE REGION" ,{ enableHtml:true, timeOut: 3000,positionClass: 'toast-top-right'});
        //this.toastr.success( 'Region ' + region.name  + " fue creado con exito!", "CREACION DE REGION" ,{ enableHtml:true, timeOut: 3000,positionClass: 'toast-top-right'});
        return res.region;
      }).catch( err => {
        //console.log(err, '<<<<< error');
        let errorcause = err.error.message;
        if(errorcause.indexOf("Ya existe la llave")){
          // this.toastr.error( "NO SE PUEDE CREAR UN REGION CON EL NOMBRE: " + region.name.toUpperCase() + " YA EXISTENTE" , 'CREACION DE REGION',{ timeOut: 3000,positionClass: 'toast-top-right',closeButton:true});
        }else{
          // this.toastr.error( "NO SE PUEDE CREAR UN REGION CON EL NOMBRE: " + region.name.toUpperCase() , 'CREACION DE REGION',{ timeOut: 3000,positionClass: 'toast-top-right'});
        }
        
        return Observable.throw( err );
      });
  }
  
  update( region: Region ) {

    let url = URL_SERVICIOS + '/region';
    
    return this.http.put( url, region ,  { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( (resp: any) => {
                  // this.toastr.success( resp.nombre, 'region Actualizado!',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return true;
                });

  }
  
  get(id: string){
    let url = URL_SERVICIOS + '/region/' + id;
    return this.http.get( url, { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} )
                    .map(resp => resp);
  }

  delete( id: string ) {
    let url = URL_SERVICIOS + '/region/' + id;
    //url += '?token=' + this.token;
    return this.http.delete( url ,  { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( resp => {
                  // this.toastr.success( 'La Region a sido eliminado correctamente', 'Region BORRADO!',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return true;
                }).catch( err => {
                  // console.log(err.error.message, 'error en backend');
                  // this.toastr.warning( "NO SE PUEDE ELIMINAR EL REGISTRO CONSULTE CON SU ADMINSTRADOR!" , 'ELIMINACION DE REGION',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return Observable.throw( err );
                });

  }
  // list( desde: number = 0 ) {
  //   let url = URL_SERVICIOS + '/region';//?desde=' + desde;
  //   return this.http.get( url, { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} );
  // }
  list( page: Page ) {
  const url = URL_SERVICIOS + '/region/?paginate={"limit":' + page.limit + ',"numberPage":' + page.numberPage + '}&isPaginate=true';
  return this.http.get( url, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} );
  }
}
