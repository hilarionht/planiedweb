

import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Person } from './../../../models/person.model';
import { PersonService,
  EmployeeService,
  LoaderService } from '../../../services/service.index';
import { ColorsService } from '../../../shared/colors/colors.service';
import { Page } from '../../../models/Page';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { load } from '@angular/core/src/render3';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PersonsComponent implements OnInit {

    page = new Page();
    rows = [];
    temp = [];
    prop: any;
    dir: any='';
    loading: boolean = true;
    reorderable: boolean = true;
    swapColumns: boolean = false;

  person: Person;
  persons: Person [] = [];
  persons2: any [] = [];
  _limitNumber = 10;
  _limit = 10;
  limitOptions = [
    {
      key: '5',
      value: 5
    },
    {
      key: '10',
      value: 10
    },
    {
      key: '20',
      value: 20
    }
  ];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
    public _personService: PersonService,
    public router: Router,
    public http: HttpClient,
    public colors: ColorsService,
    public _empleyeeService: EmployeeService,
    public loaderService: LoaderService
    ) {
          this.page.limit = 10;
     }


  ngOnInit() {
    this.setPage({ offset: 0 });
  }
  setPage(pageInfo) {
    this.page.numberPage = pageInfo.offset + 1;

    this.page.dir = this.dir;
    this.page.prop = this.prop;
    // console.log(this.page);
    this._empleyeeService.list(this.page).subscribe((resp: any) => {
       // console.log(resp);
        this.rows = resp.data.entities;
        this.temp = resp.data.entities;
        this.page = resp.data;
        this.page.numberPage = resp.data.numberPage - 1;
        setTimeout(() => { this.loading = false; }, 1500);
    });
  }
  edit(id: string) {
    this.router.navigate(['/person/employee', id]);
  }
  delete(id: string) {
    this._personService.delete(id).subscribe(() => { this.loadPersons(); });
  }
  loadPersons() {
    this._personService.list().subscribe((resp: any) => {
        // console.log('list:', resp);
      this.persons = resp.data.entities;
    });
    // this._empleyeeService.list().subscribe((resp: any) => {
    //     console.log('empleyee list:   ' , resp);
    //     this.persons2 = resp.data.entities;
    // });
    this._empleyeeService.employeeList(this.page).subscribe((resp: any) => {
        // console.log('empleyee:   ' , resp);
    });
  }
  onPageSizeChanged(event) {
    this.setPage({ offset: 0 });
  }
  onSort(event) {
    // event was triggered, start sort sequence
    this.loading = true;
    // emulate a server request with a timeout
    setTimeout(() => {
      const sort = event.sorts[0];
      this.prop = sort.prop;
      this.dir =  sort.dir;
      this.setPage({ offset: 0 });
      this.loading = false;
    }, 1000);
  }
  private _changeRowLimits(event) {
    this._limitNumber = parseInt(event.value, 10);
    this.page.limit = this._limitNumber;
    this.setPage(this.page);
  }
  private onPaginated(event) {
    this.table.limit = this._limitNumber;
    this.table.recalculate();
  }
}
