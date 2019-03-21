import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../../models/user.model';
import { Subject } from 'rxjs';
import { ColorsService } from '../../../shared/colors/colors.service';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Page } from '../../../models/Page';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  page = new Page();
  rows = new Array<User>();
  temp = [];
  users: User[] = [];
  totalRegistros = 0;
  cargando = true;
  dtTrigger: Subject<any> = new Subject();
  datosTabla: User[];
  public loading: false;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
    public colors: ColorsService,
    public _userService: UserService,
    public router: Router
    ) { }

  ngOnInit() {
    this.loadUsers();
    this.setPage({ offset: 0 });
  }
  editUser(user: User) {
    console.log(user);
    this.router.navigate(['/user', user.id]);
}
delete(id: string) {
  this._userService.delete(id).subscribe((resp: any) => {
    if (resp) {
      this.loadUsers();
    }
  });
}
loadUsers() {
  this._userService.list().subscribe((resp: any) => {
    this.users = resp.data;
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
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
}
}
