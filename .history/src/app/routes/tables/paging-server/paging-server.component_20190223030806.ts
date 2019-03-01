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
    this.page.limit = 10;
  }

  ngOnInit() {
    this.setPage({ offset: 0 });
  }

  setPage(pageInfo) {
    this.page.numberPage = pageInfo.offset + 1;
    // console.log('page info', pageInfo);
    // console.log('PAGE: ' , this.page);
    this.provinceService.pagin(this.page).subscribe((resp: any) => {
      this.rows = resp.data.entities;
      this.page = resp.data;
      this.page.numberPage = resp.data.numberPage - 1;
    });
  }
}
