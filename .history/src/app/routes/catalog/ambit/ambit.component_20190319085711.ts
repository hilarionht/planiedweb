import { Component, OnInit } from '@angular/core';
import { Page } from '../../../models/Page';
import { Ambit } from 'src/app/models/ambit.model';
import { FormGroup } from '@angular/forms';
import { AmbitService } from 'src/app/services/ambit/ambit.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ambit',
  templateUrl: './ambit.component.html',
  styleUrls: ['./ambit.component.scss']
})
export class AmbitComponent implements OnInit {
  page = new Page();
  temp = [];
  rows = [];
  formRegion: FormGroup;
  ambit: Ambit;
  title = 'CREAR';
  constructor(
    public _ambitService: AmbitService,
    public router: Router,
    public modalService: NgbModal
  ) {}

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
  confirm(pdelete, id: any) {
    this.title = 'ELIMINAR';
    this.ambit = new Ambit('', '0');
    if (id) {
      this._ambitService.get(id).subscribe((resp: any) => {
        this.ambit = resp.data;
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
    this._ambitService.delete(id).subscribe((resp: any) => {
      this.setPage({ offset: 0 });
    });
    this.modalService.dismissAll(pdelete);
  }
}
