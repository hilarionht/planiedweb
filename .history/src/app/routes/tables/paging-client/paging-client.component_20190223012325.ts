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
      <ngx-datatable #table class='bootstrap no-detail-row' [columnMode]="'force'" [footerHeight]="50" [rowHeight]="'auto'" [limit]="10" [rows]='provs'>
      <ngx-datatable-column name="Id" prop="id"></ngx-datatable-column>
      <ngx-datatable-column name="Provincia" prop="name"></ngx-datatable-column>
      <ngx-datatable-column name="Fecha Alta" prop="createdAt" headerClass="is-gender" [cellClass]="getCellClass"></ngx-datatable-column>
      <ngx-datatable-column name="Modificado" prop="updatedAt"></ngx-datatable-column>
      <!--  -->
      <!-- <ngx-datatable-column name="Options" sortable="false" prop="id">
          <template let-column="column" let-sort="sortFn" ngx-datatable-header-template>
              {{column.name}}
          </template>
          <template let-row="provs" let-value="value" ngx-datatable-cell-template>
              <button md-icon-button (click)="blockAgents(value)" [disabled]="row['status']==='BLOCKED'">
                  <i class="fa fa-ban"></i>
              </button>
              <button md-icon-button (click)="approveAgent(value)" [disabled]="row['status']==='APPROVED'">
                  <i class="fa fa-check"></i>
              </button>
          </template>
      </ngx-datatable-column> -->
      <ngx-datatable-column name="Actions" sortable="false" prop="id" [width]="100">
          <ng-template let-row="provs" let-value="value" ngx-datatable-cell-template>
              <button class="btn btn-sm btn-danger" (click)="delete(value)">
                  <i class="fa fa-trash"></i>
                </button>
              <button class="btn btn-sm btn-success" (click)="update(value)">
                  <i class="fa fa-edit"></i>
                </button>
          </ng-template>
      </ngx-datatable-column>
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
