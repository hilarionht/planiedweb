import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Page } from '../../../models/Page';
import { Ambit } from '../../../models/ambit.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AmbitService } from '../../../services/ambit/ambit.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-ambit',
  templateUrl: './ambit.component.html',
  styleUrls: ['./ambit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AmbitComponent implements OnInit {
  page = new Page();
  temp = [];
  rows = [];
  frmAU: FormGroup;
  ambit: Ambit;
  title = 'CREAR';
  loading = false;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
    public _ambitService: AmbitService,
    public router: Router,
    public modalService: NgbModal
  ) {
    this.frmAU = new FormGroup({
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
  setPage(pageInfo) {
    this.page.numberPage = pageInfo.offset + 1;
    this._ambitService.list(this.page).subscribe((resp: any) => {
      this.rows = resp.data.entities;
      this.temp = resp.data.entities;
      this.page = resp.data;
      this.page.numberPage = resp.data.numberPage - 1;
    });
  }
  save($ev, value: any) {
    // console.log(this.frmAU.value);
    // console.log(value);
    $ev.preventDefault();
    // tslint:disable-next-line:forin
    for (const c in this.frmAU.controls) {
      this.frmAU.controls[c].markAsTouched();
    }
    if (this.frmAU.valid) {
      if (this.frmAU.value.id === '0') {
        this._ambitService.create(this.frmAU.value).subscribe(resp => {
          this.setPage({offset: 0 });
        });
      } else {
        this._ambitService.update(this.frmAU.value).subscribe(resp => {
          this.setPage({offset: 0 });
        });
      }
      this.frmAU.reset();
      this.modalService.dismissAll();
    }
    // console.log(this.frmAU.value);
  }

  open(content, id: string) {
    this.frmAU = new FormGroup({
      id: new FormControl('0'),
      name: new FormControl('', [Validators.required]),
      createdAt: new FormControl(''),
      updatedAt: new FormControl('')
    });
    if (id) {
      this._ambitService
        .get(id)
        .subscribe((resp: any) => (this.ambit = resp.data));
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',  backdropClass: 'light-blue-backdrop'}).result.then((result) => {
      }, (reason) => {
    });
  }
  editbyid(content, id: string) {
    this.ambit = new Ambit('', '0');
    this.loading = true;
    if (id) {
      this._ambitService.get(id).subscribe((resp: any) => {
        this.ambit = resp.data;
        this.frmAU.patchValue(resp.data);
        this.loading = false;
        this.modalService
          .open(content, {
            ariaLabelledBy: 'modal-basic-title',
            backdropClass: 'light-blue-backdrop'
          })
          .result.then(result => {}, reason => {});
          });
    }
  }
  confirm(pdelete, id: any) {
    this.title = 'ELIMINAR';
    this.loading = true;
    this.ambit = new Ambit('', '0');
    if (id) {
      this._ambitService.get(id).subscribe((resp: any) => {
        this.ambit = resp.data;
        this.loading = false;
        this.modalService
            .open(pdelete, {
              ariaLabelledBy: 'modal-basic-title',
              backdropClass: 'light-blue-backdrop'
            })
            .result.then(() => {}, () => {});
      });
    }
  }
  delete(pdelete, id: string) {
    this._ambitService.delete(id).subscribe((resp: any) => {
      this.setPage({ offset: 0 });
    });
    this.modalService.dismissAll(pdelete);
  }
  search(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function(d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
}
