import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { Sector } from '../../../models/sector.model';
import { SectorService } from '../../../services/service.index';
import { Page } from '../../../models/Page';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrls: ['./sector.component.scss']
})
export class SectorComponent implements OnInit {
  sector: Sector;
  title = '';
  rows = [];
  temp = [];
  page = new Page();
  constructor(
    public sectorService: SectorService,
    public modalService: NgbModal
  ) { }

  ngOnInit() {
  }
  confirm(pdelete, id: any) {
  this.title = 'ELIMINAR';
  this.sector = new Sector(null, '0', null, null);
  if (id) {
    this.sectorService.get(id).subscribe((resp: any) => {this.sector = resp.data; });
  }
  this.modalService.open(pdelete, {ariaLabelledBy: 'modal-basic-title',  backdropClass: 'light-blue-backdrop'}).result.then(() => {
  }, () => {
  });
  }
  delete(pdelete, id: string) {
  this.sectorService.delete(id).subscribe((resp: any) => {
  this.setPage({ offset: 0 });
  });
  this.modalService.dismissAll(pdelete);
  }
  setPage(pageInfo) {
    this.page.numberPage = pageInfo.offset + 1;
    this.sectorService.list().subscribe((resp: any) => {
      console.log('SET DATA SECTOR: ',resp);
      // this.rows = resp.data.entities;
      // this.temp = resp.data.entities;
      // this.page = resp.data;
      // this.page.numberPage = resp.data.numberPage - 1;
    });
  }
  open(content, id: string) {
    this.sector = new Sector('', '0');
    if (id) {
      this.sectorService.get(id).subscribe((resp: any) => this.sector = resp.data);
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',  backdropClass: 'light-blue-backdrop'}).result.then((result) => {
    }, (reason) => {
    });
  }
  save(content, form?: NgForm) {
    if (form.value.id !== '0') {
      form.value.name = form.value.name.toUpperCase();
      this.sectorService.update(form.value)
      .subscribe(res => {
        this.setPage({offset: 0});
      });
    } else {
      form.value.name = form.value.name.toUpperCase();
      this.sectorService.create(form.value)
        .subscribe(resp => {
          this.setPage({offset: 0});
        });
    }
    if (form) {
      form.reset();
    }
    this.modalService.dismissAll(content);
  }
}
