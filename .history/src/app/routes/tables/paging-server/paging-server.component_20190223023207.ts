import { Component, OnInit } from '@angular/core';
import { ProvinceService } from '../../../services/service.index';
import { Page } from '../../../models/Page';
import { Province } from '../../../models/province.model';

@Component({
  selector: 'app-paging-server',
  templateUrl: './paging-server.component.html',
  styleUrls: ['./paging-server.component.scss']
})
export class PagingServerComponent implements OnInit {
  page = new Page();
  rows = new Array<Province>();
  constructor(public provinceService: ProvinceService  ) {
    this.page.numberPage = 0;
    this.page.limit = 10;
    this.load();
  }

  ngOnInit() {
    this.setPage({ offset: 0 });
  }

  setPage(pageInfo) {
    this.page.numberPage = pageInfo.offset;
    this.provinceService.list().subscribe((resp: any) => {
      this.rows = resp.data;
      console.log(resp.data);
      this.page = resp.data;
    });
    // this.serverResultsService.getResults(this.page).subscribe(pagedData => {
    //   this.page = pagedData.page;
    //   this.rows = pagedData.data;
    // });
  }

  load() {
    this.provinceService.pagin(this.page).subscribe((resp: any) => {
      this.rows = resp.data;
      console.log(resp);
      this.page = resp.data;
    });
  }
}
