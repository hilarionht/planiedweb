import { Institution } from './../../../models/institution.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Page } from '../../../models/Page';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { InstitutionService , ProvinceService, DepartamentService, LocalityService } from '../../../services/service.index';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-institution',
  templateUrl: './institution.component.html',
  styleUrls: ['./institution.component.scss']
})
export class InstitutionComponent implements OnInit {
  page = new Page();
  rows = new Array<Institution>();
  rowsFilter = [];

  temp = [];
  provinces = [];
  departaments = [];
  localities = [];
  initutions: Institution[] = [];
  display = 'none';
  institution: Institution;
  id: any;
  closeResult: string;
  title = 'CREAR';
  formInst: FormGroup;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
    public _depService: DepartamentService,
    public _provService: ProvinceService,
    public _localityService: LocalityService,
    public _initutionService: InstitutionService,
    public modalService: NgbModal,
    public router: Router
  ) {
    this.formInst = new FormGroup({
      id: new FormControl('0'),
      name: new FormControl('', [Validators.required]),
      createdAt: new FormControl(''),
      updatedAt: new FormControl(''),
      cue: new FormControl(''),
      registration_number: new FormControl(''),
      locality_id: new FormControl(''),
      region_id: new FormControl(''),
      ambit_id: new FormControl(''),
      province_id: new FormControl(''),
      department_id : new FormControl('')
    });
    this.page.limit = 10;
  }

  ngOnInit() {
    this._provService.list().subscribe((resp: any) => {
      console.log(resp);
      
      this.provinces = resp.data;
    });
    this._initutionService.list(this.page).subscribe((resp: any) => {
      console.log(resp.data);
      this.rows = resp.data;
    });
  }
  // open(content, id: string) {
  //   this.title = 'AGREGAR';
  //   this.institution = new Institution(null, null, null, null, null, null, null, null, id);
  //   if (id) {
  //     this._initutionService
  //       .get(id)
  //       .subscribe((resp: any) => (this.institution = resp.data));
  //   }
  //   this.modalService
  //     .open(content, {
  //       ariaLabelledBy: 'modal-basic-title',
  //       backdropClass: 'light-blue-backdrop'
  //     })
  //     .result.then(result => {}, reason => {});
  // }
  editbyid(content, id: string) {
    this.title = 'EDITAR';
    this.institution = new Institution(null, null, null, null, null, null, null, null, id);
    if (id) {
      this._initutionService
        .get(id)
        .subscribe((resp: any) => {
          this.institution = resp.data;
          console.log(resp, 'data');
          
          this.formInst.setValue(resp.data);
        });
    }
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        backdropClass: 'light-blue-backdrop'
      })
      .result.then(result => {}, reason => {});
  }
  save($ev, value: any) {
    // console.log(this.formInst);

    $ev.preventDefault();
    // tslint:disable-next-line:forin
    for (const c in this.formInst.controls) {
      this.formInst.controls[c].markAsTouched();
    }
    if (this.formInst.valid) {
      if (this.formInst.value.id === '0') {
        this._initutionService.create(this.formInst.value).subscribe(resp => {
          //this.setPage({offset: 0 });
        });
      } else {
        this._initutionService.update(this.formInst.value).subscribe(resp => {
          // this.formInst.reset();
          //this.setPage({offset: 0 });
        });
      }
      this.formInst.reset();
      this.modalService.dismissAll();
      // let user = new User( value.username, value.password, null,null,null,null,null,null,null,null);
      // this._userService.login(user).subscribe(() => this.router.navigate(['/']));
    }
    //console.log(this.formInst.value);
  }
  
  open(content, id: string) {
    this.formInst = new FormGroup({
      id: new FormControl('0'),
      name: new FormControl('', [Validators.required]),
      createdAt: new FormControl(''),
      updatedAt: new FormControl(''),
      cue: new FormControl('', [Validators.required]),
      registration_number: new FormControl(''),
      locality_id: new FormControl(''),
      region_id: new FormControl(''),
      ambit_id: new FormControl(''),
      province_id: new FormControl(''),
      department_id : new FormControl('')
    });
    if (id) {
      this._initutionService
        .get(id)
        .subscribe((resp: any) => (this.institution = resp.data));
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',  backdropClass: 'light-blue-backdrop'}).result.then((result) => {
      }, (reason) => {
    });
  }
}
