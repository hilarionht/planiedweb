
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { Ng2TableModule } from 'ng2-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PersonsComponent } from './persons/persons.component';
import { LoginGuard } from '../../services/service.index';
import { EmployeeComponent } from './employee/employee.component';
import { PhoneComponent } from './phone/phone.component';
import { PersonDeleteComponent } from './person-delete/person-delete.component';
import { PersonComponent } from './person/person.component';
import { NgxSelectModule } from 'ngx-select-ex';
// import { defineLocale } from 'ngx-bootstrap/chronos';
// import { esLocale } from 'ngx-bootstrap/locale';
// defineLocale('es', esLocale); 

const routes: Routes = [
  { path: '', redirectTo: 'employees' },
  // { path: 'regiones', component: RegionComponent },
  // { path: 'instituciones', component: InstitucionComponent , canActivate: [LoginGuard]},
  // { path: 'telefono/:id', component: TelefonoComponent , canActivate: [LoginGuard]},
  // { path: 'tipotelefono', component: TipotelefonosComponent , canActivate: [LoginGuard]},
   { path: 'person/:id', component: PersonComponent , canActivate: [LoginGuard]},
   { path: 'employee/:id', component: EmployeeComponent , canActivate: [LoginGuard]},
   { path: 'employees', component: PersonsComponent , canActivate: [LoginGuard]}
];
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    NgxSelectModule,
    Ng2TableModule,
    NgxDatatableModule
  ],
  declarations: [
    PersonComponent,
    PersonsComponent,
    EmployeeComponent,
    PhoneComponent,
    PersonDeleteComponent
  ], 
  exports:[
    RouterModule
  ]
})
export class PersonModule { }
