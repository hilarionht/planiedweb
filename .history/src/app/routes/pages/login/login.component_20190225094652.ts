import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../core/settings/settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../models/user.model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    valForm: FormGroup;

    constructor(public settings: SettingsService,
                            fb: FormBuilder,
                public _userService: UserService,
                public router: Router,
                public activateRoute: ActivatedRoute) {

        this.valForm = fb.group({
            'username': [null, Validators.required],
            'password': [null, Validators.required]
        });

    }

    submitForm($ev, value: any) {
        $ev.preventDefault();
        for (let c in this.valForm.controls) {
            this.valForm.controls[c].markAsTouched();
        }
        if (this.valForm.valid) {
            let user = new User( value.username, value.password, null,null,null,null,null,null,null,null);
            this._userService.login(user).subscribe(() => this.router.navigate(['/']));
        }
    }

    ngOnInit() {

    }

}
