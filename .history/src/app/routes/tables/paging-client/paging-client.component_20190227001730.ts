import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ProvinceService } from '../../../services/province/province.service';
@Component({
  selector: 'app-paging-client',
  templateUrl: './paging-client.component.html' ,
  styleUrls: ['./paging-client.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PagingClientComponent implements OnInit {
  rows = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(public provinceService: ProvinceService) {
    this.load();
   }

  ngOnInit() {
  }
  load()  {
    this.provinceService.list().subscribe(
      (resp: any) => {
        this.rows = resp.data;
      }
    );
  }
}
