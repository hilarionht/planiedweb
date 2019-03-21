
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PhoneTypeService } from '../../../services/phoneType/phone-type.service';
import { PhoneType } from '../../../models/phoneType.model';

import { Page } from '../../../models/Page';
import { DatatableComponent } from '@swimlane/ngx-datatable';
@Component({
  selector: 'app-phone-type',
  templateUrl: './phone-type.component.html',
  styleUrls: ['./phone-type.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PhoneTypeComponent implements OnInit {
  page = new Page();
  rows = new Array<PhoneType>();
  rowsFilter = [];
  temp = [];
  formPhoneType: FormGroup;
  phonetype: PhoneType;
  phonetypes: PhoneType[] = [];
  title = 'CREAR';
  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    public _phonetypeService: PhoneTypeService,
    public router: Router,
    public modalService: NgbModal
  ) {
    this.formPhoneType = new FormGroup({
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
    console.log(this.formPhoneType);

    $ev.preventDefault();
    // tslint:disable-next-line:forin
    for (const c in this.formPhoneType.controls) {
      this.formPhoneType.controls[c].markAsTouched();
    }
    if (this.formPhoneType.valid) {
      if (this.formPhoneType.value.id === '0') {
        this._phonetypeService.create(this.formPhoneType.value).subscribe(resp => {
          this.setPage({offset: 0 });
        });
      } else {
        this._phonetypeService.update(this.formPhoneType.value).subscribe(resp => {
          this.setPage({offset: 0 });
        });
      }
      this.formPhoneType.reset();
      this.modalService.dismissAll();
    }
    console.log(this.formPhoneType.value);
  }

  open(content, id: string) {
    this.formPhoneType = new FormGroup({
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
    this.phonetype = new PhoneType('', '0');
    if (id) {
      this._phonetypeService.get(id).subscribe((resp: any) => {
        this.phonetype = resp.data;
        this.formPhoneType.setValue(resp.data);
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
    this.phonetype = new PhoneType('', '0');
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
      console.log(resp);
      
      this.rows = resp.data.entities;
      this.temp = resp.data.entities;
      this.page = resp.data;
      this.page.numberPage = resp.data.numberPage - 1;
    });
  }
}
