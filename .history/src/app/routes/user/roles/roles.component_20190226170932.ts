import { Component, OnInit } from '@angular/core';
import { Role } from '../../../models/role.model';
import { RoleService } from '../../../services/service.index';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgbModal,  ModalDismissReasons, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Page } from 'src/app/models/Page';

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
  public rows: Array<any> = [];
  public columns: Array<any> = [
      { title: 'Nombre', className: ['office-header', 'text-success'], name: 'name', sort: 'asc' },
      { title: 'Fecha de Alta', className: 'text-warning', name: 'createdAt' },
      { title: 'Fecha de Actulizacion', className: 'text-warning', name: 'updatedAt' }
  ];
  public page2: number = 1;
  public itemsPerPage: number = 10;
  public maxSize: number = 5;
  public numPages: number = 1;
  public length: number = 0;

  constructor(
    public _rolService: RoleService,
    public router: Router,
    private modalService: NgbModal

  ) {  this.length = this.ng2TableRoles.length; }
  public ng2TableRoles: Array<any> = [];
  public config: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered', 'mb-0', 'd-table-fixed']
};
  ngOnInit() {   
    this.onChangeTable(this.config);
    this._rolService.list().subscribe((resp:any) => {
      this.roles = resp.data;
      this.ng2TableRoles = resp.data;
      this.data = resp.data;
      // console.log(this.ng2TableRoles);
      
    });
    this.role  = new Role(null,'0');

  }

  public changePage(page: any, data: Array<any> = this.ng2TableRoles): Array<any> {
    let start = (page.page - 1) * page.itemsPerPage;
    let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
    return data.slice(start, end);
}

public changeSort(data: any, config: any): any {
    if (!config.sorting) {
        return data;
    }

    let columns = this.config.sorting.columns || [];
    let columnName: string = void 0;
    let sort: string = void 0;

    for (let i = 0; i < columns.length; i++) {
        if (columns[i].sort !== '' && columns[i].sort !== false) {
            columnName = columns[i].name;
            sort = columns[i].sort;
        }
    }

    if (!columnName) {
        return data;
    }

    // simple sorting
    return data.sort((previous: any, current: any) => {
        if (previous[columnName] > current[columnName]) {
            return sort === 'desc' ? -1 : 1;
        } else if (previous[columnName] < current[columnName]) {
            return sort === 'asc' ? -1 : 1;
        }
        return 0;
    });
}

public changeFilter(data: any, config: any): any {

    let filteredData: Array<any> = data;
    this.columns.forEach((column: any) => {
        if (column.filtering) {
            filteredData = filteredData.filter((item: any) => {
                return item[column.name].match(column.filtering.filterString);
            });
        }
    });

    if (!config.filtering) {
        return filteredData;
    }

    if (config.filtering.columnName) {
        return filteredData.filter((item: any) =>
            item[config.filtering.columnName].match(this.config.filtering.filterString));
    }

    let tempArray: Array<any> = [];
    filteredData.forEach((item: any) => {
        let flag = false;
        this.columns.forEach((column: any) => {
            if (item[column.name].toString().match(this.config.filtering.filterString)) {
                flag = true;
            }
        });
        if (flag) {
            tempArray.push(item);
        }
    });
    filteredData = tempArray;

    return filteredData;
}

  public onChangeTable(config: any, page: any = { page: this.page, itemsPerPage: this.itemsPerPage }): any {
    if (config.filtering) {
        (<any>Object).assign(this.config.filtering, config.filtering);
    }

    if (config.sorting) {
        (<any>Object).assign(this.config.sorting, config.sorting);
    }

    let filteredData = this.changeFilter(this.ng2TableRoles, this.config);
    let sortedData = this.changeSort(filteredData, this.config);
    this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
    this.length = sortedData.length;
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
