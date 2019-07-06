
import { NgModule } from '@angular/core';
import { ProvinceComponent } from './province/province.component';
import { RegionComponent } from './region/region.component';
import { SectorComponent } from './sector/sector.component';
import { AmbitComponent } from './ambit/ambit.component';
import { CatalogComponent } from './catalog/catalog.component';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuard } from '../../services/service.index';
import { SharedModule } from '../../shared/shared.module';
import { Ng2TableModule } from 'ng2-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxSelectModule } from 'ngx-select-ex';
import { DepartamentComponent } from './departament/departament.component';
import { LocalityComponent } from './locality/locality.component';
import { ToasterService } from 'angular2-toaster';
import { PhoneTypeComponent } from './phone-type/phone-type.component';
import { PhoneReferenceComponent } from './phone-reference/phone-reference.component';
import { TagInputModule } from 'ngx-chips';
import { LevelComponent } from './level/level.component';

const routes: Routes = [
  { path: '', redirectTo: 'catalog' },
  { path: 'region', component: RegionComponent },
  // { path: 'institution', component: InstitutionComponent , canActivate: [LoginGuard]},
  { path: 'provinc', component: ProvinceComponent , canActivate: [LoginGuard]},
  { path: 'sector', component: SectorComponent , canActivate: [LoginGuard]},
  { path: 'ambit', component: AmbitComponent , canActivate: [LoginGuard]},
  { path: 'phoneType', component: PhoneTypeComponent , canActivate: [LoginGuard]},
  { path: 'phoneReference', component: PhoneReferenceComponent , canActivate: [LoginGuard]},
  { path: 'catalog', component: CatalogComponent , canActivate: [LoginGuard]},
  { path: 'level', component: LevelComponent , canActivate: [LoginGuard]},
  { path: 'department/:id', component: DepartamentComponent , canActivate: [LoginGuard]},
  { path: 'locality/:id/:provinceId', component: LocalityComponent , canActivate: [LoginGuard]}
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    NgxSelectModule,
    Ng2TableModule,
    NgxDatatableModule,
    TagInputModule
  ],
  declarations: [
    ProvinceComponent,
    RegionComponent,
    SectorComponent,
    AmbitComponent,
    // InstitutionComponent,
    CatalogComponent,
    DepartamentComponent,
    LocalityComponent,
    PhoneTypeComponent,
    PhoneReferenceComponent,
    LevelComponent
  ],
  exports: [
    RouterModule
  ], providers: [
    ToasterService
  ]
})
export class CatalogModule { }
