import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { TagInputModule } from 'ngx-chips';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2TableModule } from 'ng2-table';
import { NgxSelectModule } from 'ngx-select-ex';
import { RouterModule } from '@angular/router';
import { InstitutionsComponent } from './institutions/institutions.component';
import { ToasterService } from 'angular2-toaster';
import { INTITUTION_ROUTES } from './institution.routes';
import { InstitutionComponent } from './institution/institution.component';

@NgModule({
  imports: [
    SharedModule,
    INTITUTION_ROUTES,
    NgxSelectModule,
    Ng2TableModule,
    NgxDatatableModule,
    TagInputModule
  ],
  declarations: [
    InstitutionComponent,
    InstitutionsComponent
  ],
  exports: [
    RouterModule
  ], providers: [
    ToasterService
  ]
})
export class InstitutionModule { }
