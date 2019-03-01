import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../user/user.service';



@Injectable()
export class VerificaTokenGuard implements CanActivate {
  constructor(  
    public _usuarioService: UserService, 
    public router: Router
    ){

  }
  canActivate(
    ): Promise<boolean> | boolean {
      console.log('token guard ');
      
      let token = this._usuarioService.token;
      let payload = JSON.parse( atob(token.split('.')[1] ));
      console.log( payload );
      let expirado = this.expirado( payload.exp );
      if(expirado){
        return false;
      }
      //return true;
      this.verficToken(payload.exp);
  }
  expirado (fechaExp:number){
    let ahora = new Date().getDate() / 1000;

    if( fechaExp < ahora) {
      return true;
    }else{
      return false
    }
  }
  verficToken(fechaEspe:number ):Promise<boolean> {
    return new Promise((resolve,reject)=>{
      let tokenExp = new Date(fechaEspe * 1000); // esta en segundo debe estar en milesegundos
      let ahora = new Date();
      ahora.setTime(ahora.getTime() + (4 * 60 * 1000) );//si faltan 4 horas renueva token podrias probar con 1
      // console.log(tokenExp);
      // console.log(ahora);
      if(tokenExp.getTime() > ahora.getTime()){
        resolve(true);
      }else{
        this._usuarioService.updateToken().subscribe( () =>{
          resolve(true);
        },() => {
          this.router.navigate(['/login']);
          reject(false);
        });
      }
      
      resolve(true);
      
    });
  }
}
