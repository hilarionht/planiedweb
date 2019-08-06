import { Component, OnInit, Injector } from '@angular/core';
import { SettingsService } from '../../../core/settings/settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/service.index';
import { ToasterService } from 'angular2-toaster';
import { User } from '../../../models/user.model';

@Component({
    selector: 'app-lock',
    templateUrl: './lock.component.html',
    styleUrls: ['./lock.component.scss']
})
export class LockComponent implements OnInit {

    valForm: FormGroup;
    router: Router;

    constructor(
                public injector: Injector,
                public settings: SettingsService,
                public _userService: UserService,
                public activateRoute: ActivatedRoute,
                public toasterService: ToasterService,
                                    fb: FormBuilder) {

        this.valForm = fb.group({
            'password': [null, Validators.required]
        });
        localStorage.removeItem('token');
    }

    submitForm($ev, value: any) {
        $ev.preventDefault();
        for (let c in this.valForm.controls) {
            this.valForm.controls[c].markAsTouched();
        }
        if (this.valForm.valid) {
            let u = JSON.parse(localStorage.getItem('user'));
            let user = new User( u.username, value.password, null, null, null, null, null, null, null, null);
            this._userService.login(user).subscribe(() => {
                this.router.navigate(['/']);
                // this.router.navigate(['home']);
                } , (err: any) => {
                    this.toasterService.pop('warning', 'Error de acceso', err);
            });

        }
    }

    ngOnInit() {
        this.router = this.injector.get(Router);
    }

}
