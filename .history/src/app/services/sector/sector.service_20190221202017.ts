import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Sector } from '../../models/sector.model';
import { URL_SERVICIOS } from '../../config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SectorService {

  sector:Sector;

  constructor(
    public http: HttpClient, 
    public router: Router,
    private toastr: ToastrService
  ) { }
  create( sector: Sector ) {
    let url = URL_SERVICIOS + '/sector';
    console.log(' create sector: ',sector);
    return this.http.post(url, sector ,  { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)})
      .map((res: any) => {
        this.toastr.success( sector.name , 'sector Exitosa!',{ timeOut: 3000,positionClass: 'toast-top-right'});
        return res.sector;
      }).catch( err => {
        console.log(err, 'error en backend');
        this.toastr.warning( err.error.errors.message , 'Error en generar sector!',{ timeOut: 3000,positionClass: 'toast-top-right'});
        return Observable.throw( err );
      });;
  }
  update( sector: Sector ) {

    let url = URL_SERVICIOS + '/sector';
    console.log(url);
    
    return this.http.put( url, sector ,  { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( (resp: any) => {
                  this.toastr.success( resp.nombre, 'sector Actualizado!',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return true;
                });

  }
  
  get(id: string){
    let url = URL_SERVICIOS + '/sector/' + id;
    return this.http.get( url, { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} )
                    .map(resp => resp);
  }

  delete( id: string ) {
    let url = URL_SERVICIOS + '/sector/' + id;
    //url += '?token=' + this.token;
    return this.http.delete( url ,  { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( resp => {
                  this.toastr.success( 'El sector a sido eliminado correctamente', 'sector BORRADO!',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return true;
                });

  }
  
  list( desde: number = 0 ) {
    let url = URL_SERVICIOS + '/sector';//?desde=' + desde;
    return this.http.get( url, { headers:new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} );
  }
}
