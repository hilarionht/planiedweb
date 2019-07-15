import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../core/settings/settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../models/user.model';
import { ToasterService } from 'angular2-toaster/src/toaster.service';
import { ToasterConfig } from 'angular2-toaster/src/toaster-config';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    valForm: FormGroup;
    toasterConfig: any;
    toasterconfig: ToasterConfig = new ToasterConfig({
        positionClass: 'toast-top-right',
        showCloseButton: true,
        animation: 'fade'
    });
    constructor(public settings: SettingsService,
                            fb: FormBuilder,
                public _userService: UserService,
                public router: Router,
                public activateRoute: ActivatedRoute,
                public toasterService: ToasterService) {

        this.valForm = fb.group({
            'username': [null, Validators.required],
            'password': [null, Validators.required]
        });

    }

    submitForm($ev, value: any) {
        $ev.preventDefault();
        // tslint:disable-next-line:forin
        for (let c in this.valForm.controls) {
            this.valForm.controls[c].markAsTouched();
        }
        if (this.valForm.valid) {
            let user = new User( value.username, value.password, null, null, null, null, null, null, null, null);
            this._userService.login(user).subscribe(() => { this.router.navigate(['/']); } , (err) => {
                console.log('Error en el Componente');
                this.toasterService.pop('warning', 'Error de Servicio', 'Se produjo un error');
            });
        }
    }

    ngOnInit() {

    }

}
