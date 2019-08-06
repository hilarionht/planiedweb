
import { User } from './../../../models/user.model';
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormGroup, FormBuilder, ValidatorFn, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { RoleService } from '../../../services/role/role.service';
import { Role } from '../../../models/role.model';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  user: User;
  rol: Role;
  id : any;
  roles: Role[] = [];
  accion:string='Alta';
  userForm: FormGroup;
  blackList = ['bad@email.com', 'some@mail.com', 'wrong@email.co'];
  constructor(
    public userService: UserService, 
    public rolService: RoleService,
    public routeActivate: ActivatedRoute,
    public router: Router,
    fb: FormBuilder
  ) { 
    let password = new FormControl('', Validators.required);
        let certainPassword = new FormControl('', CustomValidators.equalTo(password));

        // Model Driven validation
        this.userForm = fb.group({

            'sometext': [null, Validators.required],
            'checkbox': [null, Validators.required],
            'radio': ['', Validators.required],
            'select': [null, Validators.required],
            'digits': [null, Validators.pattern('^[0-9]+$')],
            'minlen': [null, Validators.minLength(6)],
            'maxlen': [null, Validators.maxLength(10)],

            'email': [null, CustomValidators.email],
            'url': [null, CustomValidators.url],
            'date': [null, CustomValidators.date],
            'number': [null, Validators.compose([Validators.required, CustomValidators.number])],
            'alphanum': [null, Validators.pattern('^[a-zA-Z0-9]+$')],
            'minvalue': [null, CustomValidators.min(6)],
            'maxvalue': [null, CustomValidators.max(10)],
            'minwords': [null, this.minWords(6)],
            'maxwords': [null, this.maxWords(10)],
            'minmaxlen': [null, CustomValidators.rangeLength([6, 10])],
            'range': [null, CustomValidators.range([10, 20])],
            'rangewords': [null, Validators.compose([this.minWords(6), this.maxWords(10)])],
            'email_bl': [null, this.checkBlackList(this.blackList) ],

            'passwordGroup': fb.group({
                password: password,
                confirmPassword: certainPassword
            })

        });

    this.routeActivate.params.subscribe( param => {
      this.id = param['id'];
      
      this.user = new User(null,null,null,null,true,null,null,null,null,this.id);
      if(this.id != '0'){
        this.userService.getById(this.id).subscribe((user:any) => {
          this.user = user.data[0];
          this.rol = user.data[0].role;
          // this.user.role_id = this.rol.id;
          this.user.role = this.rol.id;
          this.accion='Edicion';
        } );
      }
      this.loadRoles();
    });
    
  }
submitForm($ev, value: any) {
        $ev.preventDefault();
        for (let c in this.userForm.controls) {
            this.userForm.controls[c].markAsTouched();
        }
        if (this.userForm.valid) {
            // console.log('Valid!');
        }
        // console.log(value);
    }

    minWords(checkValue): ValidatorFn {
        return <ValidatorFn>((control: FormControl) => {
            return (control.value || '').split(' ').length >= checkValue ? null : { 'minWords': control.value };
        });
    }

    maxWords(checkValue): ValidatorFn {
        return <ValidatorFn>((control: FormControl) => {
            return (control.value || '').split(' ').length <= checkValue ? null : { 'maxWords': control.value };
        });
    }

    checkBlackList(list: Array<string>): ValidatorFn {
        return <ValidatorFn>((control: FormControl) => {
            return list.indexOf(control.value) < 0 ? null : { 'blacklist': control.value };
        });
    }
  ngOnInit() {
  }
  addUser(form?:NgForm){
    // console.log('clicked'+ this.id, 'FormValue: '+ form.value.id);
    // console.log(form.value);
    
    if(form.value.id ==="0") {
      this.userService.create(form.value)
        .subscribe(res => {
          this.resetForm(form);
          this.router.navigate(['config/users']);
        });
    } else {
      this.userService.update(form.value)
      .subscribe(res => {
        this.resetForm(form);
        this.router.navigate(['config/users']);
      });
    }
  }

  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
      //this.getUsers();
    }
  }
  loadRoles(){
    this.rolService.list().subscribe((resp:any) => {
        this.roles = resp.data;
    });
  }
}
