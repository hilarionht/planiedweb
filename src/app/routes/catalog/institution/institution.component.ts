import { Institution } from './../../../models/institution.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Page } from '../../../models/Page';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { InstitutionService,
  ProvinceService,
  DepartamentService,
  LocalityService,
  RegionService,
  AmbitService,
  SectorService
} from '../../../services/service.index';
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
  regions = [];
  ambits = [];
  sectors = [];
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
    public _regionService: RegionService,
    public _ambitService: AmbitService,
    public _sectorService: SectorService,
    public modalService: NgbModal,
    public router: Router
  ) {
    this.formInst = new FormGroup({
      id: new FormControl('0'),
      name: new FormControl('', [Validators.required]),
      createdAt: new FormControl(''),
      updatedAt: new FormControl(''),
      cue: new FormControl(''),
      registrationNumber: new FormControl('0'),
      locality: new FormControl(''),
      region: new FormControl(''),
      ambit: new FormControl(''),
      sector: new FormControl(''),
      province: new FormControl(''),
      department : new FormControl('')
    });
    this.page.limit = 10;
  }

  ngOnInit() {
    this.loading = true;
    this._provService.list().subscribe((resp: any) => {
      this.provinces = resp.data;
    });
    this._regionService.getAll().subscribe((resp: any) => {
      this.regions = resp.data;
    });
    this._sectorService.list().subscribe((resp: any) => {
      this.sectors = resp.data;
    });
    this._ambitService.getAll().subscribe((resp: any) =>{
      this.ambits = resp.data;
    });
    this.setPage({offset: 0 });
  }
  setPage(pageInfo) {
    this.page.numberPage = pageInfo.offset + 1;
    this._initutionService.list(this.page).subscribe((resp: any) => {
      this.rows = resp.data;
      this.temp = resp.data;
      this.loading = false;
    });
  }
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
      sector: new FormControl(''),
      province: new FormControl(''),
      department : new FormControl('')
    });
    if (id) {
      this._initutionService
        .getById(id)
        .subscribe((resp: any) => {
          this.institution = resp.data;
          const dataForm = resp.data; console.log(dataForm, 'get data by id' );
          this._localityService.listbyDepartment(dataForm.locality.department.id).subscribe((response: any) => {
            this.localities = response.data[0].localities;
          });
          this._depService.listbyProvince(dataForm.locality.department.province.id).subscribe((response: any) => {
            this.departments = response.data[0].departments;
          });
          this._provService.list().subscribe((response: any) => {
            this.provinces = response.data;
          });
          this.formInst.setValue({
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
    for (const c in this.formInst.controls) {
      this.formInst.controls[c].markAsTouched();
    }
    if (this.formInst.valid) {
      console.log(this.formInst.value, 'form save');
      
      if (this.formInst.value.id === '0') {
        this._initutionService.create(this.formInst.value).subscribe(resp => {
          this.setPage({offset: 0 });
        });
      } else {
        this._initutionService.update(this.formInst.value).subscribe(resp => {
          this.formInst.reset();
          this.setPage({offset: 0 });
        });
      }
      this.formInst.reset();
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
  open(content, id: string) {
    this.formInst = new FormGroup({
      id: new FormControl('0'),
      name: new FormControl('', [Validators.required]),
      createdAt: new FormControl(''),
      updatedAt: new FormControl(''),
      cue: new FormControl('', [Validators.required]),
      registrationNumber: new FormControl('0'),
      locality: new FormControl(''),
      region: new FormControl(''),
      ambit: new FormControl(''),
      sector: new FormControl(''),
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
