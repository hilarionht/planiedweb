import { log } from 'util';
import { Component, OnInit } from '@angular/core';
import { Department } from '../../../models/departament.model';
import { DepartamentService, ProvinceService } from '../../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Province } from '../../../models/province.model';


@Component({
  selector: 'app-departament',
  templateUrl: './departament.component.html',
  styleUrls: ['./departament.component.scss']
})
export class DepartamentComponent implements OnInit {


  departments: Department[] = [];
  provincs: Province[] = [];
  display:string ="none";
  department: Department;
  id:string;
  provinceid: string;
  province:Province;
  constructor(
    public _depService: DepartamentService,
    public _provService: ProvinceService,
    public routeActivate: ActivatedRoute,
    public router: Router

  ) {

    this.routeActivate.params.subscribe( param => {
      this.id = param['id'];
      console.log(param);
      
      this.provinceid = this.id;
      // console.log(this.id);
      if(this.id){
        this._depService.listbyProvince(this.id).subscribe( (resp:any)=> {
          // console.log(resp.data[0]);
          this.province= resp.data[0];
          this.departments = resp.data[0].departments;
        });
      }
      
    });
   }

  ngOnInit() {
    // this._depService.list().subscribe((resp:any) => {
    //   this.departments = resp.data;
    // });
    this.department  = new Department(null,this.provinceid,'0');
   // this.province = new Province("","","")
    // this._provService.list().subscribe(
    //   (resp:any)=> {
    //     this.provincs = resp.data;
    //   }
    // );
  }
  add(){
    let date = new Date();
    this.display = 'block';
    this.department = new Department(null, this.provinceid,'0');
    
  }
  edit(department:Department){
    this.department = department;
  }
  save(form?: NgForm) {
    
    form.value.name = form.value.name.toUpperCase();
    if(form.value.id!='0') {
      this._depService.update(form.value)
      .subscribe(res => {
        this.resetForm(form);
        this.getDepartaments();
      });
    } else {
      this._depService.create(form.value)
        .subscribe(res => {
          this.resetForm(form);
          this.getDepartaments();
        });
    }
    //this.modalService.dismissAll(this.CloseModal);
  }
  getDepartaments(){
    // console.log(this.provinceid);
    
    this._depService.listbyProvince(this.provinceid).subscribe((resp:any) => {
      this.province= resp.data[0];
          this.departments = resp.data[0].departments;
    });
  }
  close(){
    this.display = 'none';
  }
  provinces(){
      this.router.navigate(['/catalog/provinc']);
  }

  locality(id:string) {
    this.router.navigate(['catalog/locality', id,this.provinceid]);
   }
   delete(id:string){
    this._depService.delete(id).subscribe((resp:any)=> { 
      // console.log(resp); 
      this.getDepartaments();
    });
  
  }
  
  editbyid(content,id:string) {
    this.department = new Province(null,'0',null,null)
    if(id){
      this._depService.get(id).subscribe((resp:any)=> this.department = resp.data);
    }
    // this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',  backdropClass: 'light-blue-backdrop'}).result.then((result) => {
    //   //this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
  }
  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
      //this.getUsers();
    }
  }
  open(content,id:string) {
    this.department = new Department(null,this.provinceid,'0')
    if(id){
      this._depService.get(id).subscribe((resp:any)=> this.department = resp.data);
    }
    // this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',  backdropClass: 'light-blue-backdrop'}).result.then((result) => {
    //   //this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   //this.closeResult = `Dismissed ${ this.getDismissReason(reason) }`;
    // });
  }
  CloseModal(data:string, form?:NgForm){
    // console.log(form.value);
    
    //this.modalService.dismissAll(this.CloseModal);
  }
}
