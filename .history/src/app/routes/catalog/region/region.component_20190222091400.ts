import { Component, OnInit } from '@angular/core';
import { FormGroup , FormControl, Validators} from '@angular/forms'
import { Region } from '../../../models/region.model';
import { RegionService } from '../../../services/region/region.service';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { timingSafeEqual } from 'crypto';
@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss']
})
export class RegionComponent  {

  formRegion: FormGroup;
  region: Region;
  regions: Region[] = [];

  constructor(
    public _regionService: RegionService,
    public router: Router
  ) 
  {
    this.formRegion = new FormGroup({
      'id':new FormControl('0'),
      'name':new FormControl('',[Validators.required, 
                                this.regionNoExist]),
      'createdAt': new FormControl(''),
      'updatedAt': new FormControl('')
    });
    this.loadRegions();
   }
  save($ev, value: any){
    console.log(this.formRegion);
    
    $ev.preventDefault();
        for (let c in this.formRegion.controls) {
            this.formRegion.controls[c].markAsTouched();
        }
        if (this.formRegion.valid) {
          if(this.formRegion.value.id ==='0'){
            this._regionService.create(this.formRegion.value).subscribe(resp=>{
              // this.formRegion.reset();
              this.loadRegions();
            });
          }else{
            this._regionService.update(this.formRegion.value).subscribe(resp=>{
              // this.formRegion.reset();
              this.loadRegions();
            });
           
          }
          this.formRegion.reset();
          // this.modalService.dismissAll();
            // let user = new User( value.username, value.password, null,null,null,null,null,null,null,null);
            // this._userService.login(user).subscribe(() => this.router.navigate(['/']));
        }
    console.log(this.formRegion.value);
    
  }

  open(content,id:string) {
    this.formRegion = new FormGroup({
      'id':new FormControl('0'),
      'name':new FormControl('',[Validators.required, 
                                this.regionNoExist]),
      'createdAt': new FormControl(''),
      'updatedAt': new FormControl('')
    });
    if(id){
      this._regionService.get(id).subscribe((resp:any)=> this.region = resp.data);
    }
    // this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',  backdropClass: 'light-blue-backdrop'}).result.then((result) => {
    //   }, (reason) => {
    // });
  }
  loadRegions(){
    this._regionService.list().subscribe((reps:any)=> {
      this.regions = reps.data;
    });
  }
  regionNoExist(){

    return null;
  }
  delete(id:string){
    this._regionService.delete(id).subscribe((resp:any)=> { 
       //console.log(resp); 
       this.loadRegions();
    });
  }
  editbyid( content,id:string){
    this.region = new Region('','0');
    if(id){
      this._regionService.get(id).subscribe((resp:any)=> {
        this.region = resp.data;
        this.formRegion.setValue(resp.data);
      });
    }
    // this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',  backdropClass: 'light-blue-backdrop'}).result.then((result) => {
    //   //this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
  }
}
