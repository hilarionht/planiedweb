import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ProvinceService } from '../../../services/service.index';
import { Page } from '../../../models/Page';
import { Province } from '../../../models/province.model';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-paging-server',
  templateUrl: './paging-server.component.html',
  styleUrls: ['./paging-server.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PagingServerComponent implements OnInit {
  page = new Page();
  rows = new Array<Province>();
  temp = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  
  constructor(public provinceService: ProvinceService  ) {
    this.page.limit = 10;
  }

  ngOnInit() {
    this.setPage({ offset: 0 });
  }

  setPage(pageInfo) {
    this.page.numberPage = pageInfo.offset + 1;
    // console.log('PAGE server: ' , this.page);
    this.provinceService.pagin(this.page).subscribe((resp: any) => {
      this.rows = resp.data.entities;
      this.temp = resp.data.entities;
      this.page = resp.data;
      // console.log('date return: ', resp);
      this.page.numberPage = resp.data.numberPage - 1;
    });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    //console.log(val);
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
