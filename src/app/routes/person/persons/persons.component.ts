

import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Person } from './../../../models/person.model';
import { PersonService } from '../../../services/service.index';
import { ColorsService } from '../../../shared/colors/colors.service';
import { EmployeeService } from '../../../services/employee/employee.service';
import { Page } from '../../../models/Page';
import { DatatableComponent } from '@swimlane/ngx-datatable';


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
  person: Person;
  persons: Person [] = [];
  persons2: any [] = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  
  constructor(
    public _personService: PersonService,
    public router: Router,
    public http: HttpClient,
    public colors: ColorsService,
    public _empleyeeService: EmployeeService
    ) {
          this.page.limit = 10;
     }


  ngOnInit() {
    this.setPage({ offset: 0 });
  }
  setPage(pageInfo) {
    this.page.numberPage = pageInfo.offset + 1;
    this._empleyeeService.list(this.page).subscribe((resp: any) => {
      // console.log(resp);
        this.rows = resp.data.entities;
        this.temp = resp.data.entities;
        this.page = resp.data;
        this.page.numberPage = resp.data.numberPage - 1;
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
}
