import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal,  ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Role } from '../../../models/role.model';
import { RoleService } from '../../../services/service.index';


import * as _ from 'lodash';
import { Page } from '../../../models/Page';
import { ToasterService } from 'angular2-toaster';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RolesComponent implements OnInit {
  page = new Page();
  rows = new Array<Role>();
  temp = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  roles: Role[] = [];
  display:string ="none";
  role: Role;
  id:any;
  data: any;
  closeResult: string;
  public page2: number = 1;
  public itemsPerPage: number = 10;
  public maxSize: number = 5;
  public numPages = 1;
  public length = 0;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
    public _rolService: RoleService,
    public router: Router,
    private modalService: NgbModal,
    private toasterService: ToasterService

  ) {  this.getRoles(); }
  ngOnInit() {
    this._rolService.list().subscribe((resp: any) => {
      this.roles = resp.data;
      this.data = resp.data;
      this.rows = resp.data;
    });
    this.role  = new Role(null, '0');
    this.setPage({ offset: 0 });
  }

  setPage(pageInfo) {
    this.page.numberPage = pageInfo.offset + 1;
    this._rolService.Roles(this.page).subscribe((resp: any) => {
      this.rows = resp.data.entities;
      this.temp = resp.data.entities;
      this.page = resp.data;
      this.page.numberPage = resp.data.numberPage - 1;
      setTimeout(() => { this.loadingIndicator = false; }, 1500);
    });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    console.log(val);
    // filter our data
    const temp = this.temp.filter(function(d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  add() {
    const date = new Date();
    this.display = 'block';
    this.role = new Role(null, '0', date.toString());

  }
  edit(role: Role) {
    this.role = role;
  }
  saves(form?: NgForm) {
    // modal.close();
    // modal.close();
  }
  save(form?: NgForm) {
    form.value.name = form.value.name.toUpperCase();
    if (form.value.id != 0) {
      this._rolService.update(form.value)
      .subscribe((res: any) => {
        console.log(res);
        
        if (res.succes === true) {
          this.toasterService.pop('success', 'MODIFICACION', 'ROL MODIFICADO CON EXITO!');
        }
        this.getRoles();
        this.setPage({ offset: 0 });
        this.resetForm(form);
      });
    } else {
      this._rolService.create(form.value)
        .subscribe((res: any) => {
          if (res.succes === true) {
            this.toasterService.pop('success', 'MODIFICACION', 'ROL MODIFICADO CON EXITO!');
          }
          this.getRoles();
          this.setPage({ offset: 0 });
          this.resetForm(form);
        });
    }
    this.modalService.dismissAll(this.CloseModal);
  }
  CloseModal(data: string, form?: NgForm) {
    console.log(form.value);

    this.modalService.dismissAll(this.CloseModal);
  }
  deleteRole(id: string) {
    this._rolService.delete(id).subscribe((resp: any) => { console.log(resp); this.getRoles(); this.setPage({offset: 0 });
    });
  }
  getRoles() {
    this._rolService.list().subscribe((resp: any) => {
      this.roles = resp.data as Role[];
      this.data = resp.data;
    });
  }
  close() {
    this.display = 'none';
  }
  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
      // this.getUsers();
    }
  }

  open(content, id: string) {
    this.role = new Role(null, '0', null, null);
    if (id) {
      this._rolService.get(id).subscribe((resp: any) => this.role = resp);
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',  backdropClass: 'light-blue-backdrop'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  public onCellClick(data: any): any {
    console.log(data);
}
  editbyid(content, id: string) {
    this.role = new Role(null, '0', null, null);
    if (id) {
      this._rolService.get(id).subscribe((resp: any) => {this.role = resp.data; });
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',  backdropClass: 'light-blue-backdrop'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any, form?: NgForm): string {
    console.log('form:  ', form);
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
