import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ProvinceService } from '../../../services/province/province.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
@Component({
  selector: 'app-paging-client',
  template: `
    <div>
      <h3>
        Client-side Paging
      </h3>
      <ngx-datatable
        class="material"
        [rows]="rows"
        [columns]="[{name:'Name'},{name:'createdAt'},{name:'updatedAt'}]"
        [columnMode]="'force'"
        [headerHeight]="50"
        [footerHeight]="50"
        [rowHeight]="'auto'"
        [limit]="10">
      </ngx-datatable>
    </div>
  `,
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
      this.rows = resp;
      }
    );
  }
}
