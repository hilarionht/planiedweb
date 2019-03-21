import { PersonComponent } from './person/person.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { Ng2TableModule } from 'ng2-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PersonsComponent } from './persons/persons.component';
import { LoginGuard } from '../../services/service.index';
import { EmployeeComponent } from './employee/employee.component';
import { PhoneComponent } from './phone/phone.component';

const routes: Routes = [
  { path: '', redirectTo: 'persons' },
  // { path: 'regiones', component: RegionComponent },
  // { path: 'instituciones', component: InstitucionComponent , canActivate: [LoginGuard]},
  // { path: 'telefono/:id', component: TelefonoComponent , canActivate: [LoginGuard]},
  // { path: 'tipotelefono', component: TipotelefonosComponent , canActivate: [LoginGuard]},
   { path: 'person/:id', component: PersonComponent , canActivate: [LoginGuard]},
   { path: 'persons', component: PersonsComponent , canActivate: [LoginGuard]}
  
];
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    Ng2TableModule,
    NgxDatatableModule
  ],
  declarations: [
    PersonComponent,
    PersonsComponent,
    EmployeeComponent,
    PhoneComponent
  ], 
  exports:[
    RouterModule
  ]
})
export class PersonModule { }
