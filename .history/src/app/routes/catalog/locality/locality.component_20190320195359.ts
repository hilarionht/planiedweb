import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Department } from './../../../models/departament.model';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  LocalityService,
  DepartamentService,
  ProvinceService
} from '../../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { Page } from '../../../models/Page';
import { Locality } from './../../../models/locality.model';
import { DatatableComponent } from '@swimlane/ngx-datatable';
@Component({
  selector: 'app-locality',
  templateUrl: './locality.component.html',
  styleUrls: ['./locality.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LocalityComponent implements OnInit {
  page = new Page();
  localities: Locality[] = [];
  display = 'none';
  locality: Locality;
  id: any;
  depatmentid: string;
  rows = [];
  temp = [];
  title = 'CREAR';
  provinceId: string;
  department: Department;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
    public _depService: DepartamentService,
    public _provService: ProvinceService,
    public _localityService: LocalityService,
    public routeActivate: ActivatedRoute,
    public router: Router,
    public modalService: NgbModal
  ) {
    this.page.limit = 10;
    this.routeActivate.params.subscribe(param => {
      this.id = param['id'];
      this.provinceId = param['provinceId'];
      this.depatmentid = this.id;
      if (this.id) {
        this.getLocalitys();
        this.setPage({ offset: 0 });
      }
    });
  }

  ngOnInit() {
    this.setPage({ offset: 0 });
    this.locality = new Locality(null, this.depatmentid, '0');
  }
  add() {
    const date = new Date();
    this.display = 'block';
    this.locality = new Locality(null, '0');
  }
  edit(locality: Locality) {
    this.locality = locality;
  }
  save(form?: NgForm) {
    if (form.value.id !== '0') {
      form.value.name = form.value.name.toUpperCase();
      this._localityService.update(form.value).subscribe(res => {
        this.resetForm(form);
        this.getLocalitys();
      });
    } else {
      form.value.name = form.value.name.toUpperCase();
      this._localityService.create(form.value).subscribe(res => {
        this.resetForm(form);
        this.getLocalitys();
      });
    }
    this.modalService.dismissAll(this.CloseModal);
  }
  getLocalitys() {
    this._localityService
      .listbyDepartment(this.depatmentid)
      .subscribe((resp: any) => {
        this.rows = resp.data[0].localities;
        this.locality = resp.data[0];
        this.department = resp.data[0];
        this.localities = resp.data[0].localities;
      });
  }
  close() {
    this.display = 'none';
  }

  editbyid(content, id: string) {
    this.title = 'EDITAR';
    this.locality = new Locality(null, this.depatmentid, '0');
    if (id) {
      this._localityService
        .get(id)
        .subscribe((resp: any) => (this.locality = resp.data));
    }
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        backdropClass: 'light-blue-backdrop'
      })
      .result.then(result => {}, reason => {});
  }
  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
      // this.getUsers();
    }
  }
  open(content, id: string) {
    this.title = 'AGREGAR';
    this.locality = new Locality(null, this.depatmentid, '0');
    if (id) {
      this._localityService
        .get(id)
        .subscribe((resp: any) => (this.locality = resp.data));
    }
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        backdropClass: 'light-blue-backdrop'
      })
      .result.then(result => {}, reason => {});
  }
  CloseModal(data: string, form?: NgForm) {
    // this.modalService.dismissAll(this.CloseModal);
  }
  departaments() {
    this.router.navigate(['catalog/department', this.provinceId]);
  }
  setPage(pageInfo) {
    this.page.numberPage = pageInfo.offset + 1;
    this._localityService
      .list(this.page, this.depatmentid)
      .subscribe((resp: any) => {
        this.temp = resp.data.entities;
        this.page = resp.data;
        this.locality = resp.data[0];
        this.department = resp.data[0];
        this.rows = resp.data[0].localities;
      });
  }
  search(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function(d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
  }
  confirm(pdelete, id: any) {
    this.title = 'ELIMINAR';
    this.locality = new Locality('', '', '0');
    if (id) {
      this._localityService.get(id).subscribe((resp: any) => {
        this.locality = resp.data;
      });
    }
    this.modalService
      .open(pdelete, {
        ariaLabelledBy: 'modal-basic-title',
        backdropClass: 'light-blue-backdrop'
      })
      .result.then(() => {}, () => {});
  }
  delete(pdelete, id: string) {
    this._localityService.delete(id).subscribe((resp: any) => {
      this.setPage({ offset: 0 });
    });
    this.modalService.dismissAll(pdelete);
  }
}
