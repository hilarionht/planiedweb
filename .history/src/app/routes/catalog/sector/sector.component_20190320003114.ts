import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { Sector } from '../../../models/sector.model';
import { SectorService } from '../../../services/service.index';
import { Page } from '../../../models/Page';

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
      console.log(resp);
      
      // this.rows = resp.data.entities;
      // this.temp = resp.data.entities;
      // this.page = resp.data;
      // this.page.numberPage = resp.data.numberPage - 1;
    });
  }
}
