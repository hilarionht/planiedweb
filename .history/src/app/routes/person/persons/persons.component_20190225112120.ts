
import { Person } from './../../../models/person.model';
import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../../services/service.index';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ColorsService } from '../../../shared/colors/colors.service';
import { EmployeeService } from '../../../services/employee/employee.service';


@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss']
})
export class PersonsComponent implements OnInit {


  person :Person;
  persons : Person [] =[];
    persons2 : any [] = [];
  limit: number = 0;
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
          http.get('assets/server/chart/spline.json').subscribe(data => this.splineData = data);
          this.loadPersons();
     }
     public rows: Array<any> = [];
     public columns: Array<any> = [
         { title: 'Nombre', name: 'lastname', filtering: { filterString: '', placeholder: 'Fitrar por Nombre' } },
         { title: 'Apellido', name: 'firstname',  sort: false,  filtering: { filterString: '', placeholder: 'filtrar por apellido' } },
         { title: 'Dni', className: ['office-header', 'text-success'], name: 'identityDocument', sort: 'asc' },
         { title: 'Email', name: 'email', sort: '', filtering: { filterString: '', placeholder: 'Filter by extn.' } },
         { title: 'Alta', className: 'text-warning', name: 'createdAt' },
         { title: 'direccion', name: 'addres' }
     ];
     public page: number = 1;
     public itemsPerPage: number = 10;
     public maxSize: number = 5;
     public numPages: number = 1;
     public length: number = 0;
     public ng2TableData: Array<any> = [];
     public config: any = {
         paging: true,
         sorting: { columns: this.columns },
         filtering: { filterString: '' },
         className: ['table-striped', 'table-bordered', 'mb-0', 'd-table-fixed']
     };
  ngOnInit() {
    this.loadPersons();
  }
  edit(id:string){
    console.log(id);
    
    this.router.navigate(['/person/person', id]);
  }
  delete(id: string){
    this._personService.delete(id).subscribe(()=>{ this.loadPersons(); });
  }
  loadPersons(){
    this._personService.list().subscribe((resp:any) => {
        console.log(resp);
        
      this.persons = resp.data.entities;
      
      this.ng2TableData = this.persons;
      this.totalEntities = resp.data.totalEntities;
      this.numberPage = resp.data.numberPage;
      this.totalPages = resp.data.totalPages;
      this.limit = resp.data.limit;

    });
    console.log('ng2tabledata:  ',this.ng2TableData);
    
    this._empleyeeService.list().subscribe((resp: any)=> {
        console.log('empleyee:   ' , resp);
        this.persons2 = resp.data.entities;
    });
  }
  public onChangeTable(config: any, page: any = { page: this.page, itemsPerPage: this.itemsPerPage }): any {
    if (config.filtering) {
        (<any>Object).assign(this.config.filtering, config.filtering);
    }

    if (config.sorting) {
        (<any>Object).assign(this.config.sorting, config.sorting);
    }

    let filteredData = this.changeFilter(this.ng2TableData, this.config);
    let sortedData = this.changeSort(filteredData, this.config);
    this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
    this.length = sortedData.length;
}

public changePage(page: any, data: Array<any> = this.ng2TableData): Array<any> {
    let start = (page.page - 1) * page.itemsPerPage;
    let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
    return data.slice(start, end);
}

public changeSort(data: any, config: any): any {
    if (!config.sorting) {
        return data;
    }

    let columns = this.config.sorting.columns || [];
    let columnName: string = void 0;
    let sort: string = void 0;

    for (let i = 0; i < columns.length; i++) {
        if (columns[i].sort !== '' && columns[i].sort !== false) {
            columnName = columns[i].name;
            sort = columns[i].sort;
        }
    }

    if (!columnName) {
        return data;
    }

    // simple sorting
    return data.sort((previous: any, current: any) => {
        if (previous[columnName] > current[columnName]) {
            return sort === 'desc' ? -1 : 1;
        } else if (previous[columnName] < current[columnName]) {
            return sort === 'asc' ? -1 : 1;
        }
        return 0;
    });
}

public changeFilter(data: any, config: any): any {

    let filteredData: Array<any> = data;
    this.columns.forEach((column: any) => {
        if (column.filtering) {
            filteredData = filteredData.filter((item: any) => {
                return item[column.name].match(column.filtering.filterString);
            });
        }
    });

    if (!config.filtering) {
        return filteredData;
    }

    if (config.filtering.columnName) {
        return filteredData.filter((item: any) =>
            item[config.filtering.columnName].match(this.config.filtering.filterString));
    }

    let tempArray: Array<any> = [];
    filteredData.forEach((item: any) => {
        let flag = false;
        this.columns.forEach((column: any) => {
            if (item[column.name].toString().match(this.config.filtering.filterString)) {
                flag = true;
            }
        });
        if (flag) {
            tempArray.push(item);
        }
    });
    filteredData = tempArray;

    return filteredData;
}

}
