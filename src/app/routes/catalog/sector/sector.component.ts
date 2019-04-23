import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Sector } from '../../../models/sector.model';
import { SectorService } from '../../../services/service.index';
import { Page } from '../../../models/Page';
import { NgForm } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrls: ['./sector.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SectorComponent implements OnInit {
  sector:  Sector;
  title = 'CREAR';
  rows = new Array<Sector>();
  rowsFilter = [];
  temp = [];
  page = new Page();
  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
    public sectorService: SectorService,
    public modalService: NgbModal
  ) { }

  ngOnInit() {
    this.setPage({offset: 0 });
  }
  editbyid(content, id: string) {
    this.title = 'EDITAR';
    this.sector = new Sector(null, '0', null, null);
    if (id) {
      this.sectorService.get(id).subscribe((resp: any) => this.sector = resp.data);
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',  backdropClass: 'light-blue-backdrop'}).result.then((result) => {
    }, (reason) => {
    });
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
       this.rows = resp.data;
       this.temp = resp.data;
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
  search(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function(d) {
    return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
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
