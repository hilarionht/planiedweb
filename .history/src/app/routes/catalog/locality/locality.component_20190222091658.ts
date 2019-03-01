import { Department } from './../../../models/departament.model';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Locality } from '../../../models/locality.model';
import { LocalityService, DepartamentService, ProvinceService } from '../../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-locality',
  templateUrl: './locality.component.html',
  styleUrls: ['./locality.component.scss']
})
export class LocalityComponent implements OnInit {

  
  localities: Locality[] = [];
  display:string ="none";
  locality: Locality;
  id:any;
  depatmentid:string;

  provinceId:string;
  department: Department;
  constructor(
    public _depService: DepartamentService,
    public _provService: ProvinceService,
    public _localityService: LocalityService,
    public routeActivate: ActivatedRoute,
    public router: Router

  ) { 
    this.routeActivate.params.subscribe( param => {
      this.id = param['id'];
      this.provinceId = param['provinceId'];
      console.log(param['provinceId']);
      
      this.depatmentid = this.id;
      if(this.id){
        this.getLocalitys();
      }
      
    });
  }

  ngOnInit() {
    // this._provService.list().subscribe((resp:any) => {
    //   this.localitys = resp.entities;
    // });
    this.locality  = new Locality(null,this.depatmentid,'0');
  }
  add(){
    let date = new Date();
    this.display = 'block';
    this.locality = new Locality(null, '0');
    
  }
  edit(locality:Locality){
    this.locality = locality;
  }
  save(form?: NgForm) {
    
    
    if(form.value.id!='0') {
      form.value.name = form.value.name.toUpperCase();
      this._localityService.update(form.value)
      .subscribe(res => {
        this.resetForm(form);
        this.getLocalitys();
      });
    } else {
      form.value.name = form.value.name.toUpperCase();
      this._localityService.create(form.value)
        .subscribe(res => {
          this.resetForm(form);
          this.getLocalitys();
        });
    }
    // this.modalService.dismissAll(this.CloseModal);
  }
  delete(id:string){
    this._localityService.delete(id).subscribe((resp:any)=> {  this.getLocalitys();
    });
  }
  getLocalitys(){
    this._localityService.listbyDepartment(this.depatmentid).subscribe((resp:any) => {
      console.log(resp);
      
      this.locality= resp.data[0];
      this.department = resp.data[0];
      this.localities = resp.data[0].localities;
    });
  }
  close(){
    this.display = 'none';
  }
  
  editbyid(content,id:string) {
    this.locality = new Locality(null,this.depatmentid,"0");
    if(id){
      this._localityService.get(id).subscribe((resp:any)=> this.locality = resp.data);
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
    this.locality = new Locality(null,this.depatmentid,"0");
    if(id!="0"){
      this._localityService.get(id).subscribe((resp:any)=> this.locality = resp.data);
    }
    // this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',  backdropClass: 'light-blue-backdrop'}).result.then((result) => {
    //   //this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   //this.closeResult = `Dismissed ${ this.getDismissReason(reason) }`;
    // });
  }
  CloseModal(data:string, form?:NgForm){
    //this.modalService.dismissAll(this.CloseModal);
  }
  departaments(){
    this.router.navigate(['catalog/department',this.provinceId]);
  }
}
