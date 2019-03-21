import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { Subject } from 'rxjs';
import { ColorsService } from '../../../shared/colors/colors.service';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Page } from '../../../models/Page';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  page = new Page();
  rows = new Array<User>();
  temp = [];
  users : User[] = [];
  totalRegistros: number = 0;
  cargando: boolean = true;
  dtTrigger: Subject<any> = new Subject();
  datosTabla: User[];
  // public dtOptions: DataTables.Settings = {};
  public loading: false;
  // @ViewChildren(DataTableDirective)
  min:number;
  max:number;
  // datatableElement: DataTableDirective;
  sparkOptions1 = {
    barColor: this.colors.byName('primary'),
    height: 20,
    barWidth: 5,
    barSpacing: 2,
    resize: true
  }
  
  sparkOptions2 = {
    barColor: this.colors.byName('purple'),
    height: 20,
    barWidth: 5,
    barSpacing: 2,
    resize: true
  }
  
  sparkOptions3 = {
    barColor: this.colors.byName('info'),
    height: 20,
    barWidth: 5,
    barSpacing: 2,
    resize: true
  }
  constructor(
    public colors: ColorsService, 
    public _userService: UserService,
    public router: Router
    ) { }

  ngOnInit() {
    this.loadUsers();
  }
  editUser(user:User){

    console.log(user);
    this.router.navigate(['/user', user.id]);
}
deleteUser(id:string){
  this._userService.delete(id).subscribe((resp:any)=> {
    console.log(resp);
    if(resp){
      this.loadUsers();
    }
  });
}
loadUsers(){
  this._userService.list().subscribe((resp:any)=> {
    this.users =resp.data;
  });
}

setPage(pageInfo) {
  this.page.numberPage = pageInfo.offset + 1;
  this._userService.user(this.page).subscribe((resp: any) => {
    this.rows = resp.data.entities;
    this.temp = resp.data.entities;
    this.page = resp.data;
    this.page.numberPage = resp.data.numberPage - 1;
  });
}
}
