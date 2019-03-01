
import { Person } from './../../../models/person.model';
import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../../services/service.index';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ColorsService } from '../../../shared/colors/colors.service';
import { EmployeeService } from '../../../services/employee/employee.service';
import { Page } from '../../../models/Page';
import { Employee } from '../../../models/employee.model';


@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss']
})
export class PersonsComponent implements OnInit {

    page = new Page();
    rows = [];
    temp = [];
  person: Person;
  persons: Person [] = [];
  persons2: any [] = [];
  limit = 0;
  isPaginate: Boolean = true;
  numberPage: number = 0;
  totalEntities: number = 0;
  totalPages: number = 0;
  

  sparkValues = [1,3,4,7,5,9,4,4,7,5,9,6,4];

  easyPiePercent: number = 70;
  pieOptions = {
      animate: {
          duration: 800,
          enabled: true
      },
      barColor: this.colors.byName('info'),
      trackColor: 'rgba(200,200,200,0.4)',
      scaleColor: false,
      lineWidth: 10,
      lineCap: 'round',
      size: 145
  };

  sparkOptions1 = {
      barColor: this.colors.byName('info'),
      height: 30,
      barWidth: '5',
      barSpacing: '2'
  };

  sparkOptions2 = {
      type: 'line',
      height: 80,
      width: '100%',
      lineWidth: 2,
      lineColor: this.colors.byName('purple'),
      spotColor: '#888',
      minSpotColor: this.colors.byName('purple'),
      maxSpotColor: this.colors.byName('purple'),
      fillColor: '',
      highlightLineColor: '#fff',
      spotRadius: 3,
      resize: true
  };

  splineHeight = 280;
  splineData: any;
  splineOptions = {
      series: {
          lines: {
              show: false
          },
          points: {
              show: true,
              radius: 4
          },
          splines: {
              show: true,
              tension: 0.4,
              lineWidth: 1,
              fill: 0.5
          }
      },
      grid: {
          borderColor: '#eee',
          borderWidth: 1,
          hoverable: true,
          backgroundColor: '#fcfcfc'
      },
      tooltip: true,
      tooltipOpts: {
          content: (label, x, y) => { return x + ' : ' + y; }
      },
      xaxis: {
          tickColor: '#fcfcfc',
          mode: 'categories'
      },
      yaxis: {
          min: 0,
          max: 150, // optional: use it for a clear represetation
          tickColor: '#eee',
          // position: ($scope.app.layout.isRTL ? 'right' : 'left'),
          tickFormatter: (v) => {
              return v/* + ' visitors'*/;
          }
      },
      shadowSize: 0
  };
  constructor( 
    public _personService: PersonService,
    public router: Router,
    public http: HttpClient,
    public colors: ColorsService,
    public _empleyeeService: EmployeeService
    ) {
          this.page.limit = 10;
          // http.get('assets/server/chart/spline.json').subscribe(data => this.splineData = data);
          this.loadPersons();
     }


  ngOnInit() {
    this.setPage({ offset: 0 });
  }
  setPage(pageInfo) {
    this.page.numberPage = pageInfo.offset + 1;
    this._empleyeeService.employeeList(this.page).subscribe((resp: any) => {
        console.log('empleados: ', resp);
        this.rows = resp.data.entities;
        this.temp = resp.data.entities;
        this.page = resp.data;
        this.page.numberPage = resp.data.numberPage - 1;
    });
  }
  edit(id: string) {
    console.log(id);
    this.router.navigate(['/person/person', id]);
  }
  delete(id: string) {
    this._personService.delete(id).subscribe(() => { this.loadPersons(); });
  }
  loadPersons() {
    this._personService.list().subscribe((resp: any) => {
        console.log(resp);
      this.persons = resp.data.entities;
      this.totalEntities = resp.data.totalEntities;
      this.numberPage = resp.data.numberPage;
      this.totalPages = resp.data.totalPages;
      this.limit = resp.data.limit;

    });
    this._empleyeeService.list().subscribe((resp: any) => {
        console.log('empleyee list:   ' , resp);
        this.persons2 = resp.data.entities;
    });
    this._empleyeeService.employeeList(this.page).subscribe((resp: any) => {
        console.log('empleyee:   ' , resp);
    });
  }
  
}
