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
  departments = [];
  localities = [];
  initutions: Institution[] = [];
  display = 'none';
  institution: Institution;
  id: any;
  closeResult: string;
  title = 'CREAR';
  formInst: FormGroup;
  loading = false;
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
      registrationNumber: new FormControl(''),
      locality: new FormControl(''),
      region: new FormControl(''),
      ambit: new FormControl(''),
      province: new FormControl(''),
      department : new FormControl('')
    });
    this.page.limit = 10;
  }

  ngOnInit() {
    this.loading = true;
    this._provService.list().subscribe((resp: any) => {
      console.log(resp);
      this.provinces = resp.data;
    });
    this._initutionService.list(this.page).subscribe((resp: any) => {
      console.log(resp.data);
      this.rows = resp.data;
      this.loading = false;
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
    this.loading = true;
    this.title = 'EDITAR';
    this.institution = new Institution(null, null, null, null, null, null, null, null, id);
    this.formInst = new FormGroup({
      id: new FormControl('0'),
      name: new FormControl('', [Validators.required]),
      createdAt: new FormControl(''),
      updatedAt: new FormControl(''),
      cue: new FormControl('', [Validators.required]),
      registrationNumber: new FormControl(''),
      locality: new FormControl(''),
      region: new FormControl(''),
      ambit: new FormControl(''),
      province: new FormControl(''),
      department : new FormControl('')
    });
    if (id) {
      this._initutionService
        .get(id)
        .subscribe((resp: any) => {
          this.institution = resp.data;
          const dataForm = resp.data; console.log(dataForm, 'data');
          this.formInst.setValue({
            id : dataForm.id,
            name: dataForm.name,
            createdAt: dataForm.createdAt,
            updatedAt: dataForm.updatedAt,
            cue: dataForm.cue,
            registrationNumber: dataForm.registrationNumber,
            locality: dataForm.locality === undefined ? null : dataForm.locality,
            region: dataForm.region === undefined ? null : dataForm.region,
            ambit: dataForm.ambit === undefined ? null : dataForm.ambit,
            province: dataForm.province === undefined ? null : dataForm.province,
            department: dataForm.department === undefined ? null : dataForm.department,
          });
          this.loading = false;
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
      console.log(this.formInst.value, 'datasformsave');
      
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
  loadDepartment(id: string) {
    console.log(id);
    
    this._depService.listbyProvince(id).subscribe((resp: any) => {
      this.departments = resp.data[0].departments;
      // console.log(this.departments);
    });
  }
  loadLocalities(id: string) {
    this._localityService.listbyDepartment(id).subscribe((resp: any) => {
      this.localities = resp.data[0].localities;
    });
  }
  open(content, id: string) {
    this.formInst = new FormGroup({
      id: new FormControl('0'),
      name: new FormControl('', [Validators.required]),
      createdAt: new FormControl(''),
      updatedAt: new FormControl(''),
      cue: new FormControl('', [Validators.required]),
      registrationNumber: new FormControl(''),
      locality: new FormControl(''),
      region: new FormControl(''),
      ambit: new FormControl(''),
      province: new FormControl(''),
      department : new FormControl('')
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
