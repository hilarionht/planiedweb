import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PhoneReferenceService } from '../../../services/service.index';
import { PhoneReference } from '../../../models/phoneReference.model';

import { Page } from '../../../models/Page';
import { DatatableComponent } from '@swimlane/ngx-datatable';
@Component({
  selector: 'app-phone-reference',
  templateUrl: './phone-reference.component.html',
  styleUrls: ['./phone-reference.component.scss']
})
export class PhoneReferenceComponent implements OnInit {
  page = new Page();
  rows = new Array<PhoneReference>();
  rowsFilter = [];
  temp = [];
  formPhoneReference: FormGroup;
  phoneReference: PhoneReference;
  phoneReferences: PhoneReference[] = [];
  title = 'CREAR';
  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    public _phoneReferenceService: PhoneReferenceService,
    public router: Router,
    public modalService: NgbModal
  ) {
    this.formPhoneReference = new FormGroup({
      id: new FormControl('0'),
      name: new FormControl('', [Validators.required]),
      createdAt: new FormControl(''),
      updatedAt: new FormControl('')
    });
    this.page.limit = 10;
  }
  ngOnInit() {
    this.setPage({ offset: 0 });
  }
  save(form?: NgForm) {
    if (form.value.id !== '0') {
      form.value.name = form.value.name.toUpperCase();
      this._phoneReferenceService.update(form.value).subscribe(res => {
        this.setPage({offset: 0 });
      });
    } else {
      form.value.name = form.value.name.toUpperCase();
      this._phoneReferenceService.create(form.value).subscribe(res => {
        this.setPage({offset: 0 });
      });
    }
    this.modalService.dismissAll();
  }
  open(content, id: string) {
    this.phoneReference =  new PhoneReference('', '0');
    if (id) {
      this._phoneReferenceService
        .get(id)
        .subscribe((resp: any) => (this.phoneReference = resp.data));
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',  backdropClass: 'light-blue-backdrop'}).result.then((result) => {
      }, (reason) => {
    });
  }
  editbyid(content, id: string) {
    this.phoneReference = new PhoneReference('', '0');
    if (id) {
      this._phoneReferenceService.get(id).subscribe((resp: any) => {
        this.phoneReference = resp.data;
        this.formPhoneReference.setValue(resp.data);
      });
    }
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        backdropClass: 'light-blue-backdrop'
      })
      .result.then(result => {}, reason => {});
  }
  confirm(pdelete, id: any) {
    this.title = 'ELIMINAR';
    this.phoneReference = new PhoneReference('', '0');
    if (id) {
      this._phoneReferenceService.get(id).subscribe((resp: any) => {
        this.phoneReference = resp.data;
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
    this._phoneReferenceService.delete(id).subscribe((resp: any) => {
      this.setPage({ offset: 0 });
    });
    this.modalService.dismissAll(pdelete);
  }
  setPage(pageInfo) {
    this.page.numberPage = pageInfo.offset + 1;
    this._phoneReferenceService.list(this.page).subscribe((resp: any) => {
      this.rows = resp.data;
      this.temp = resp.data;
    });
  }
}
