import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProvinceComponent } from './province/province.component';
import { RegionComponent } from './region/region.component';
import { SectorComponent } from './sector/sector.component';
import { AmbitComponent } from './ambit/ambit.component';
import { InstitutionComponent } from './institution/institution.component';
import { CatalogComponent } from './catalog/catalog.component';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuard } from '../../services/service.index';
import { SharedModule } from '../../shared/shared.module';
import { Ng2TableModule } from 'ng2-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DepartamentComponent } from './departament/departament.component';
import { LocalityComponent } from './locality/locality.component';
import { ToasterService } from 'angular2-toaster';

const routes: Routes = [
  { path: '', redirectTo: 'catalog' },
  { path: 'region', component: RegionComponent },
  { path: 'institution', component: InstitutionComponent , canActivate: [LoginGuard]},
  { path: 'provinc', component: ProvinceComponent },
  { path: 'sector', component: SectorComponent , canActivate: [LoginGuard]},
  { path: 'ambit', component: AmbitComponent , canActivate: [LoginGuard]},
  { path: 'catalog', component: CatalogComponent },
  { path: 'department/:id', component: DepartamentComponent , canActivate: [LoginGuard]},
  { path: 'locality/:id/:provinceId', component: LocalityComponent , canActivate: [LoginGuard]}
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    Ng2TableModule,
    NgxDatatableModule
  ],
  declarations: [
    ProvinceComponent,
    RegionComponent,
    SectorComponent,
    AmbitComponent,
    InstitutionComponent,
    CatalogComponent,
    DepartamentComponent,
    LocalityComponent
  ],
  exports: [
    RouterModule
  ], providers: [
    ToasterService
  ]
})
export class CatalogModule { }
