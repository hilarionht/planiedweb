// import { environment } from './../../../environments/environment.prod';
// import { environment } from './../../../environments/environment';

import { VerificaTokenGuard } from './../guards/verifica-token.guard';

import { SubirArchivoService } from './../subir-archivo/subir-archivo.service';
import { Injectable } from '@angular/core';
import { User } from './../../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';  // (immportar solo lo que se use)
import 'rxjs/add/operator/catch';  // (immportar solo lo que se use)

import { Router } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
// import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import * as jwt_decode from 'jwt-decode';
import { Role } from '../../models/role.model';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
import { Page } from '../../models/Page';
@Injectable()
export class UserService {

  user: User;
  role: Role;
  token: string;
  // TOASTER
  toaster: any;
  toasterConfig: any;
  toasterconfig: ToasterConfig = new ToasterConfig({
      positionClass: 'toast-bottom-right',
      showCloseButton: true
  });
  constructor(
    public http: HttpClient,
    public router: Router,
    public _modalUploadService: ModalUploadService,
    public _subirArchivoService: SubirArchivoService,
    public toasterService: ToasterService


  ) {
    this.loadStorage();
  }
  public isAuthenticated(): boolean {
    // return ( this.token.length > 5 ) ? true : false;
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    // console.log('isautenticated:  '+  new Date().getTime() + '   ' + expiresAt  );
    return new Date().getTime() < expiresAt;
  }

  getDecodedAccessToken(token: string): any {
    try {
        return jwt_decode(token);
    } catch (Error) {
        return null;
    }
  }
  logout() {
    this.user = null;
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  loadStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.user = JSON.parse(localStorage.getItem('user'));
      this.role = JSON.parse(localStorage.getItem('role'));
    } else {
      this.token = '';
      this.user = null;
      this.role = null;
    }
  }

  saveStorage(id: string, token: string, user: User , rol: Role) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', JSON.stringify(rol));
    const expiresAt = JSON.stringify((10800000) + new Date().getTime());
    localStorage.setItem('expires_at', expiresAt);
    this.user = user;
    this.token = token;
    this.role = rol;
  }

  login(user: User): Observable<any> {
    const url = URL_SERVICIOS + '/auth/login';
    return this.http.post(url, user)
              .map( (resp: any) => {
                console.log(resp, 'login......');
                
                if (resp.success === true) {
                  const tokenInfo = this.getDecodedAccessToken(resp.data.token); // decode token
                  const expireDate = tokenInfo.exp; // get token expiration dateTime
                  console.log('token decoder', tokenInfo); // show decoded token object in console
                  this.saveStorage(tokenInfo.id, resp.data.token, tokenInfo.user, tokenInfo.user.role);
                  return true;
                }
              }).catch( (err: any) => {
                console.log('22', err, user);
                
                this.toasterService.pop('warning', 'Error de Accesos', 'usuario o password invalidos');
                // throw (new Error(err.error.error));
                return Observable.throw( err );
              });
  }

  loginGoogle( token: string ) {
    const url = URL_SERVICIOS + '/login/google';
    return this.http.post(url, { token })
                .map( (resp: any) => {
                  return true;
                });
  }

  updateToken() {
    let url = URL_SERVICIOS + '/login/renuevatoken';
    url += '?token' + this.token;
    return this.http.get( url ).map(
      ( resp: any) => {
        this.token = resp.token;
        localStorage.setItem('token', this.token);
        return true;
      }
    ).catch(err => {
      this.router.navigate(['/login']);
      return Observable.throw(err);
    });
  }
  create(user: User)  {
    const url = URL_SERVICIOS + '/user';
    console.log(user);

   return this.http.post(url, user ,  { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)})
     .map((res: any) => {
      this.toasterService.pop('success', 'Usuario Creado', 'El usuario: ' + user.username + ' fue creado exitosamente!' );
       return res.user;
     }).catch( err => {
       console.log(err);
       // tslint:disable-next-line:max-line-length
       this.toasterService.pop( 'warning' , 'Error al crear el Usuario' , `No se puede generar el usuario con el nombre ${ user.username }, consulte con su administrador!` );
       return Observable.throw( err );
     });
  }
  get(id: string) {
    const url = URL_SERVICIOS + '/user/' + id;
    return this.http.get( url, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} )
                    .map(resp => resp);
  }
  update(user: User) {
    const url = URL_SERVICIOS + '/user';
    console.log(url);
    return this.http.put( url, user, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`) } )
                .map( (resp: any) => {
                  if ( user.id === this.user.id ) {
                    const userDB: User = resp;
                    this.saveStorage( userDB.id, this.token, userDB , null);
                  }
                  this.toasterService.pop('success', 'Usuario Creado', 'El usuario: ' + user.username + ' fue creado exitosamente!' );
                  // this.toastr.success( this.user.username, 'Usuario Actualizado!',{ timeOut: 3000,positionClass: 'toast-top-right'});
                  return true;
                });
  }
  delete(id: string) {
    if (this.user.id === id) {
      this.toasterService.pop('warning', 'Eliminar Usuario', 'No se puede eliminar el usuario del actual.' );
      return Observable.throw( new Error());

    } else {
      let url = URL_SERVICIOS + '/user/' + id;
      url += '?token=' + this.token;
      return this.http.delete( url )
                  .map( resp => {
                    this.toasterService.pop('success', 'Usuario Borrado', 'El usuario eliminado exitosamente!' );
                    // swal('Usuario borrado', 'El user a sido eliminado correctamente', 'success');
                    return true;
                  });
    }
  }
  list( desde: number = 0 ) {
    const url = URL_SERVICIOS + '/user'; // ?desde=' + desde;
    return this.http.get( url, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} );
  }
  users( page: Page ) { // word:  string
    console.log(page);
    const url = URL_SERVICIOS + '/user/?paginate={"limit":' + page.limit + ',"numberPage":' + page.numberPage + '}&isPaginate=true';
    return this.http.get( url, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} );
  }
  getById(id: string) {
    let url = URL_SERVICIOS + '/user/';
    url += `?filter={"relations":["role"],"where":{"id":${ id }}}`;
    return this.http.get( url, { headers: new HttpHeaders().append('Authorization', `Bearer ${  localStorage.getItem('token') }`)} )
                    .map(resp => resp);
  }

}
