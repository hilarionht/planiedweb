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
    this.load();
  }

  ngOnInit() {
    this.setPage({ offset: 1 });
  }

  setPage(pageInfo) {
    
    
    this.page.numberPage = pageInfo.offset + 1;
    console.log('page info', pageInfo);
    console.log('PAGE: ' , this.page);
    
    this.provinceService.pagin(this.page).subscribe((resp: any) => {
      this.rows = resp.data.entities;
      console.log(resp.data);
      this.page = resp.data;
    });
    // this.serverResultsService.getResults(this.page).subscribe(pagedData => {
    //   this.page = pagedData.page;
    //   this.rows = pagedData.data;
    // });
  }

  load() {
    console.log(this.page);
    
    this.provinceService.pagin(this.page).subscribe((resp: any) => {
      this.rows = resp.data.entities;
      console.log('pagin', resp);
      this.page = resp.data;
      this.page.numberPage = resp.data.numberPage - 1;
      console.log('page load', this.page);
    });
  }
}
