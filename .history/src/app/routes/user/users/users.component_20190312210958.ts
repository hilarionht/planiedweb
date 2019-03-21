import { log } from 'util';

import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { FormGroup, NgForm } from '@angular/forms';
import { Page } from './../../../models/Page';
import { User } from './../../../models/user.model';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Role } from './../../../models/role.model';
import { ColorsService } from '../../../shared/colors/colors.service';
import { UserService } from '../../../services/user/user.service';
import { RoleService } from '../../../services/service.index';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit {
  page = new Page();
  rows = new Array<User>();
  temp = [];
  users: User[] = [];
  user: User;
  rol: Role;
  id: any;
  roles: Role[] = [];
  accion = 'Alta';
  userForm: FormGroup;
  totalRegistros = 0;
  cargando = true;
  dtTrigger: Subject<any> = new Subject();
  datosTabla: User[];
  title = '';
  public loading: false;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
    public colors: ColorsService,
    public _userService: UserService,
    public roleService: RoleService,
    private modalService: NgbModal,
    public router: Router
    ) {
      this.user = new User(null, null, null, null, true, null, null, null, null, this.id);
      this.page.limit = 10;
    }

  ngOnInit() {
    this.setPage({ offset: 0 });
    this.loadRoles();
  }
  editUser(content, id: any) {
    if (id) {
        this._userService.getById(id).subscribe((user: any) => {
          this.user = user.data[0];
          this.rol = user.data[0].role;
          this.user.role = this.rol.id;
          this.title = 'EDICION';
          this.loadRoles();
        } );
      }
      // tslint:disable-next-line:max-line-length
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',  backdropClass: 'light-blue-backdrop'}).result.then((result) => {
      }, (reason) => {
      });
}
confirm(pdelete, id: any) {
  if (id) {
    this._userService.getById(id).subscribe((user: any) => {
      this.user = user.data[0];
      this.rol = user.data[0].role;
      this.user.role = this.rol.id;
      this.title = 'ELIMINAR';
      this.loadRoles();
    } );
  }
  // tslint:disable-next-line:max-line-length
  this.modalService.open(pdelete, {ariaLabelledBy: 'modal-basic-title',  backdropClass: 'light-blue-backdrop'}).result.then((result) => {
  }, (reason) => {
  });
}
delete(pdelete, id: string) {
  this._userService.delete(id).subscribe((resp: any) => {
    if (resp) {
      this.setPage({offset: 0});
    }
  });
  this.modalService.dismissAll(pdelete);
}
loadUsers() {
  this._userService.list().subscribe((resp: any) => {
    this.users = resp.data;
  });
}
loadRoles() {
  this.roleService.list().subscribe((resp: any) => {
      this.roles = resp.data;
  });
}
setPage(pageInfo) {
  this.page.numberPage = pageInfo.offset + 1;
  this._userService.users(this.page).subscribe((resp: any) => {
    this.rows = resp.data.entities;
    this.temp = resp.data.entities;
    this.page = resp.data;
    this.page.numberPage = resp.data.numberPage - 1;
  });
}
search(event) {
  const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function(d) {
      return d.username.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
}
resetForm(form?: NgForm) {
  if (form) {
    form.reset();
    // this.getUsers();
  }
}
addUser(content, form?: NgForm) {
  if (form.value.id === '0') {
    this._userService.create(form.value)
      .subscribe(res => {
        this.resetForm(form);
        this.setPage({ offset: 0 });
      });
  } else {
    this._userService.update(form.value)
    .subscribe(res => {
      this.resetForm(form);
      this.setPage({ offset: 0 });
    });
  }
  this.modalService.dismissAll(content);
}
open(content, id: string) {
  this.title = 'AGREGAR';
  this.user = new User(null, null, null, null, true, null, null, null, null, '0');
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',  backdropClass: 'light-blue-backdrop'}).result.then((result) => {
  }, (reason) => {
  });
}
}
