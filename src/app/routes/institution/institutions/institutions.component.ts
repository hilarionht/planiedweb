import { Institution } from '../../../models/institution.model';
import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Page } from '../../../models/Page';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import {
  InstitutionService,
  ProvinceService,
  DepartmentService,
  LocalityService,
  RegionService,
  AmbitService,
  SectorService
} from '../../../services/service.index';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
@Component({
  selector: 'app-institutions',
  templateUrl: './institutions.component.html',
  styleUrls: ['./institutions.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InstitutionsComponent implements OnInit {
  page = new Page();
  rows = new Array<Institution>();
  rowsFilter = [];

  temp = [];
  provinces = [];
  departments = [];
  localities = [];
  regions = [];
  ambits = [];
  sectors = [];
  thephones = [];
  initutions: Institution[] = [];
  display = 'none';
  institution: Institution;
  id: any;
  closeResult: string;
  title = 'CREAR';
  instForm: FormGroup;
  loading = false;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
    public _depService: DepartmentService,
    public _provService: ProvinceService,
    public _localityService: LocalityService,
    public _initutionService: InstitutionService,
    public _regionService: RegionService,
    public _ambitService: AmbitService,
    public _sectorService: SectorService,
    public modalService: NgbModal,
    public router: Router
  ) {
    this.page.limit = 10;
  }

  ngOnInit() {
    this.loading = true;
    // this._provService.list().subscribe((resp: any) => {
    //   this.provinces = resp.data;
    // });
    // this._regionService.getAll().subscribe((resp: any) => {
    //   this.regions = resp.data;
    // });
    // this._sectorService.list().subscribe((resp: any) => {
    //   this.sectors = resp.data;
    // });
    // this._ambitService.getAll().subscribe((resp: any) =>{
    //   this.ambits = resp.data;
    // });
    this.setPage({offset: 0 });
  }
  setPage(pageInfo) {
    this.page.numberPage = pageInfo.offset + 1;
    this._initutionService.list(this.page).subscribe((resp: any) => {
      // console.log(resp, 'datasetpage');
      this.rows = resp.data;
      this.temp = resp.data;
      this.loading = false;
    });
  }
  editbyid(content, id: string) {
    this.loading = true;
    this.title = 'EDITAR';
    this.institution = new Institution(null, null, null, null, null, null, null, null, id);
    this.instForm = new FormGroup({
      id: new FormControl('0'),
      name: new FormControl('', [Validators.required]),
      createdAt: new FormControl(''),
      updatedAt: new FormControl(''),
      cue: new FormControl('', [Validators.required]),
      registrationNumber: new FormControl(''),
      locality: new FormControl('', [Validators.required]),
      region: new FormControl('', [Validators.required]),
      ambit: new FormControl('', [Validators.required]),
      sector: new FormControl('', [Validators.required]),
      province: new FormControl('', [Validators.required]),
      department : new FormControl('', [Validators.required]),
      telefonos: new FormArray([
        new FormControl('', Validators.required)
      ])
    });
    if (id) {
      this._initutionService
        .getById(id)
        .subscribe((resp: any) => {
          this.institution = resp.data;
          const dataForm = resp.data; 
          // console.log(dataForm, 'get data by id' );
          this._localityService.listbyDepartment(dataForm.locality.department.id).subscribe((response: any) => {
            this.localities = response.data[0].localities;
          });
          this._depService.listbyProvince(dataForm.locality.department.province.id).subscribe((response: any) => {
            this.departments = response.data[0].departments;
          });
          this._provService.list().subscribe((response: any) => {
            this.provinces = response.data;
          });
          this.instForm.setValue({
            id : dataForm.id,
            name: dataForm.name,
            createdAt: dataForm.createdAt,
            updatedAt: dataForm.updatedAt,
            cue: dataForm.cue,
            registrationNumber: dataForm.registrationNumber,
            region: dataForm.region === null ? null : dataForm.region.id,
            ambit: dataForm.ambit === null ? null : dataForm.ambit.id,
            sector: dataForm.sector === null ? null : dataForm.sector.id,
            locality: dataForm.locality === null ? null : dataForm.locality.id,
            department: dataForm.locality.department === null ? null : dataForm.locality.department.id,
            province: dataForm.locality.department.province === null ? null : dataForm.locality.department.province.id
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
    $ev.preventDefault();
    // tslint:disable-next-line:forin
    for (const c in this.instForm.controls) {
      this.instForm.controls[c].markAsTouched();
    }
    if (this.instForm.valid) {
      // console.log(this.instForm.value, 'form save');
      if (this.instForm.value.id === '0') {
        this._initutionService.create(this.instForm.value).subscribe(resp => {
          this.setPage({offset: 0 });
        });
      } else {
        this._initutionService.update(this.instForm.value).subscribe(resp => {
          this.instForm.reset();
          this.setPage({offset: 0 });
        });
      }
      this.instForm.reset();
      this.modalService.dismissAll();
    }
  }
  loadDepartment(id: string) {
    this._depService.listbyProvince(id).subscribe((resp: any) => {
      this.departments = resp.data[0].departments;
    });
  }
  loadLocalities(id: string) {
    this._localityService.listbyDepartment(id).subscribe((resp: any) => {
      this.localities = resp.data[0].localities;
    });
  }
  add(){

  }
  open(content, id: string) {
    this.instForm = new FormGroup({
      id: new FormControl('0'),
      name: new FormControl('', [Validators.required]),
      createdAt: new FormControl(''),
      updatedAt: new FormControl(''),
      cue: new FormControl('', [Validators.required]),
      registrationNumber: new FormControl('0'),
      locality: new FormControl('', [Validators.required]),
      region: new FormControl('', [Validators.required]),
      ambit: new FormControl('', [Validators.required]),
      sector: new FormControl('', [Validators.required]),
      province: new FormControl('', [Validators.required]),
      department : new FormControl('', [Validators.required]),
      phones: new FormArray([
        new FormControl('4444', Validators.required)
      ])
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
  addPhone() {
    (<FormArray>this.instForm.controls['phones']).push(
      new FormControl('', Validators.required)
    );
  }
}
