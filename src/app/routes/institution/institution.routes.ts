import { RouterModule, Routes } from '@angular/router';
import { InstitutionComponent } from './institution/institution.component';
import { InstitutionsComponent } from './institutions/institutions.component';
import { LoginGuard } from '../../services/service.index';

const routes: Routes = [
    { path: '', redirectTo: 'institutions' },
    {
        path: 'institutions',
        component: InstitutionsComponent,
        // canActivate: [ VerificaTokenGuard ],
        data: { titulo: 'Institución' }, canActivate: [LoginGuard]
    },
    { path: 'institution/:id', component: InstitutionComponent, data: { titulo: 'Institucion' } , canActivate: [LoginGuard] }
];


export const INTITUTION_ROUTES = RouterModule.forChild( routes );
