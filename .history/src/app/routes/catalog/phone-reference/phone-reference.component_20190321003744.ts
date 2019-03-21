import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  phonetype: PhoneReference;
  phonetypes: PhoneReference[] = [];
  title = 'CREAR';
  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    public _phonetypeService: PhoneReferenceService,
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
  save($ev, value: any) {
    console.log(this.formPhoneReference);

    $ev.preventDefault();
    // tslint:disable-next-line:forin
    for (const c in this.formPhoneReference.controls) {
      this.formPhoneReference.controls[c].markAsTouched();
    }
    if (this.formPhoneReference.valid) {
      if (this.formPhoneReference.value.id === '0') {
        this._phonetypeService.create(this.formPhoneReference.value).subscribe(resp => {
          this.setPage({offset: 0 });
        });
      } else {
        this._phonetypeService.update(this.formPhoneReference.value).subscribe(resp => {
          this.setPage({offset: 0 });
        });
      }
      this.formPhoneReference.reset();
      this.modalService.dismissAll();
    }
    console.log(this.formPhoneReference.value);
  }

  open(content, id: string) {
    this.formPhoneReference = new FormGroup({
      id: new FormControl('0'),
      name: new FormControl('', [Validators.required]),
      createdAt: new FormControl(''),
      updatedAt: new FormControl('')
    });
    if (id) {
      this._phonetypeService
        .get(id)
        .subscribe((resp: any) => (this.phonetype = resp.data));
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',  backdropClass: 'light-blue-backdrop'}).result.then((result) => {
      }, (reason) => {
    });
  }
  editbyid(content, id: string) {
    this.phonetype = new PhoneReference('', '0');
    if (id) {
      this._phonetypeService.get(id).subscribe((resp: any) => {
        this.phonetype = resp.data;
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
    this.phonetype = new PhoneReference('', '0');
    if (id) {
      this._phonetypeService.get(id).subscribe((resp: any) => {
        this.phonetype = resp.data;
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
    this._phonetypeService.delete(id).subscribe((resp: any) => {
      this.setPage({ offset: 0 });
    });
    this.modalService.dismissAll(pdelete);
  }
  setPage(pageInfo) {
    this.page.numberPage = pageInfo.offset + 1;
    this._phonetypeService.list(this.page).subscribe((resp: any) => {
      this.rows = resp.data.entities;
      this.temp = resp.data.entities;
      this.page = resp.data;
      this.page.numberPage = resp.data.numberPage - 1;
    });
  }
}
