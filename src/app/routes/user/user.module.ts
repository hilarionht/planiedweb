// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { RoleComponent } from './role/role.component';
import { UserComponent } from './user/user.component';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { Ng2TableModule } from 'ng2-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { LoginGuard } from '../../services/service.index';
import { NgxSelectModule } from 'ngx-select-ex';
const routes: Routes = [
  { path: '', redirectTo: 'config' },
  { path: 'user/:id', component: UserComponent, canActivate: [LoginGuard] },
  { path: 'role/:id', component: RoleComponent , canActivate: [LoginGuard] },
  { path: 'users', component: UsersComponent , canActivate: [LoginGuard] },
  { path: 'roles', component: RolesComponent , canActivate: [LoginGuard] }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    // NgbModule,
    NgxSelectModule,
    Ng2TableModule,
    NgxDatatableModule
  ],
  declarations: [
    RoleComponent,
    UserComponent,
    UsersComponent,
    RolesComponent
  ],
  providers: [
    ToasterService
  ],
  exports: [
    RouterModule
  ]
})
export class UserModule { }
