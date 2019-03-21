import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Province } from '../../../models/province.model';
import { ProvinceService } from '../../../services/province/province.service';
import { Router } from '@angular/router';
import { Page } from '../../../models/Page';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-province',
  templateUrl: './province.component.html',
  styleUrls: ['./province.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProvinceComponent implements OnInit {
  page = new Page();
  rows = new Array<Province>();
  rowsFilter = [];
  provincs: Province[] = [];
  display: string = "none";
  province: Province;
  id:any;
  closeResult: string;
  columns = [
    { prop: 'name' },
    { name: 'createdAt' },
    { name: 'updatedAt' }
  ];
  columnsSort = [
      { prop: 'name' },
      { name: 'createdAt' },
      { name: 'updatedAt' }
  ];
  
  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
    public _provService: ProvinceService,
    public router: Router
  ) { 
    this.page.numberPage = 0;
    this.page.limit = 10;
  }

  ngOnInit() {
    this._provService.list().subscribe((resp:any) => {
      this.provincs = resp.data;
      this.rows = resp.data;
      this.rowsFilter = resp.data;
      console.log(resp);
      
    });
    this.province  = new Province(null,'0');
     this.setPage({ offset: 0 });
  }
  // fetch(cb) {
  //   const req = new XMLHttpRequest();
  //   req.open('GET', `assets/data/company.json`);

  //   req.onload = () => {
  //     cb(JSON.parse(req.response));
  //   };

  //   req.send();
  // }
  setPage(pageInfo){
    this.page.numberPage = pageInfo.offset;
    this._provService.list().subscribe((pagedData:any) => {
      console.log('datapage' , pagedData);
      
      this.rows = pagedData.data;
    });
  }
  add(){
    let date = new Date();
    this.display = 'block';
    this.province = new Province(null, '0');
    
  }
  edit(province:Province){
    this.province = province;
  }
  save(form?: NgForm) {
    
    
    if(form.value.id!='0') {
      form.value.name = form.value.name.toUpperCase();
      this._provService.update(form.value)
      .subscribe(res => {
        this.resetForm(form);
        this.getProvinces();
      });
    } else {
      form.value.name = form.value.name.toUpperCase();
      this._provService.create(form.value)
        .subscribe(resp => {
          this.resetForm(form);
          this.getProvinces();
          console.log('menues: ',resp);
          
        });
    }
    // this.modalService.dismissAll(this.CloseModal);
  }
  CloseModal(data:string, form?:NgForm){
    // console.log(form.value);
    
    // this.modalService.dismissAll(this.CloseModal);
  }
  getProvinces(){
    this._provService.list().subscribe((resp:any) => {
      this.provincs = resp.data as Province[];
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
  delete(id:string){
    this._provService.delete(id).subscribe((resp:any)=> { 
      // console.log(resp); this.getProvinces();
    });
  
  }
  department(id:string) {
   this.router.navigate(['catalog/department', id]);
  }
  editbyid(content,id:string) {
    this.province = new Province(null,'0',null,null)
    if(id){
      this._provService.get(id).subscribe((resp:any)=> this.province = resp.data);
    }
    // this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',  backdropClass: 'light-blue-backdrop'}).result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
  }
  open(content,id:string) {
    this.province = new Province(null,'0')
    if(id){
      this._provService.get(id).subscribe((resp:any)=> this.province = resp.data);
    }
    // this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',  backdropClass: 'light-blue-backdrop'}).result.then((result) => {
    //   //this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   //this.closeResult = `Dismissed ${ this.getDismissReason(reason) }`;
    // });
  }
  
  // private getDismissReason(reason: any,form?: NgForm): string {
  //   // console.log('form:  ', form);
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return  `with: ${reason}`;
  //   }

    
  // }
}
