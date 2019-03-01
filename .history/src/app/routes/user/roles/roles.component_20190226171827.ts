import { Component, OnInit, ViewChild } from '@angular/core';
import { Role } from '../../../models/role.model';
import { RoleService } from '../../../services/service.index';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgbModal,  ModalDismissReasons, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Page } from '../../../models/Page';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  providers:[NgbTooltipConfig]
})
export class RolesComponent implements OnInit {
  page = new Page();
  rows = new Array<Role>();
  temp = [];
  
  roles: Role[] = [];
  display:string ="none";
  role: Role;
  id:any;
  data: any;
  closeResult: string;
  public page2: number = 1;
  public itemsPerPage: number = 10;
  public maxSize: number = 5;
  public numPages: number = 1;
  public length: number = 0;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
    public _rolService: RoleService,
    public router: Router,
    private modalService: NgbModal

  ) {  this.getRoles() }
  
  ngOnInit() {
    this._rolService.list().subscribe((resp: any) => {
      this.roles = resp.data;
      this.data = resp.data;
      this.rows = resp.data;
      // console.log(this.ng2TableRoles);
      
    });
    this.role  = new Role(null,'0');
    this.setPage({ offset: 0 });
  }

  setPage(pageInfo) {
    this.page.numberPage = pageInfo.offset + 1;
    // console.log('page info', pageInfo);
    // console.log('PAGE: ' , this.page);
    this.provinceService.pagin(this.page).subscribe((resp: any) => {
      this.rows = resp.data.entities;
      this.temp = resp.data.entities;
      this.page = resp.data;
      this.page.numberPage = resp.data.numberPage - 1;
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
  
  add(){
    let date = new Date();
    this.display = 'block';
    this.role = new Role(null, '0',date.toString());
    
  }
  edit(role:Role){
    this.role = role;
  }
  saves(form?: NgForm) {
    // modal.close();
    //modal.close();
  }
  save(form?: NgForm) {
    
    // console.log('saving.... ',form.value);
    form.value.name = form.value.name.toUpperCase();
    if(form.value.id!=0) {
      this._rolService.update(form.value)
      .subscribe(res => {
        this.resetForm(form);
        this.getRoles();
      });
    } else {
      this._rolService.create(form.value)
        .subscribe(res => {
          this.resetForm(form);
          this.getRoles();
        });
    }
    this.modalService.dismissAll(this.CloseModal);
  }
  CloseModal(data:string, form?:NgForm){
    console.log(form.value);
    
    this.modalService.dismissAll(this.CloseModal);
  }
  deleteRole(id:string){
    this._rolService.delete(id).subscribe((resp:any)=> { console.log(resp); this.getRoles();
    });
  }
  getRoles(){
    this._rolService.list().subscribe((resp:any) => {
      this.roles = resp.data as Role[];
      this.data = resp.data;
      this.rows = resp.data;
    });
  }
  close(){
    this.display = 'none';
  }
  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
      //this.getUsers();
    }
  }

  open(content,id:string) {
    this.role = new Role(null,'0',null,null)
    if(id){
      this._rolService.get(id).subscribe((resp:any)=> this.role = resp);
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
  editbyid(content,id:string) {
    this.role = new Role(null,'0',null,null)
    if(id){
      this._rolService.get(id).subscribe((resp:any)=> {this.role = resp.data; });
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',  backdropClass: 'light-blue-backdrop'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any,form?: NgForm): string {
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
