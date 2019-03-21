
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';

 //import { UserService } from '../service.index';
//import { UserService } from './../../services/service.index';
import { UserService } from '../user/user.service';


@Injectable()
export class LoginGuard implements CanActivate, CanActivateChild {
  /**
   *
   */
  constructor(
    public _userService: UserService ,
    public router: Router
    ) {

  }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if ( this._userService.isAuthenticated()) {
      return true;

    } else {
      this.router.navigate(['/login']);
      return false;
    }

  }
  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    if ( this._userService.isAuthenticated()) {
      return true;

    } else {
      this.router.navigate(['/login']);
      return false;
    }

  }
}
