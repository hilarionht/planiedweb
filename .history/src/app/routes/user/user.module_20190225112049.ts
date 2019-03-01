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
import { DataTableModule } from 'angular-6-datatable';

const routes: Routes = [
  { path: '', redirectTo: 'config' },
  { path: 'user/:id', component: UserComponent },
  { path: 'role/:id', component: RoleComponent },
  { path: 'users', component: UsersComponent },
  { path: 'roles', component: RolesComponent }
  
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    // NgbModule,
    Ng2TableModule,
    NgxDatatableModule,
    DataTableModule
  ],
  declarations: [
    RoleComponent, 
    UserComponent, 
    UsersComponent, 
    RolesComponent
  ],
  exports: [
    RouterModule
  ]
})
export class UserModule { }
