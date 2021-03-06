import { JobService } from './../../../services/job/job.service';
import { DepartmentService } from './../../../services/department/department.service';
import { LocalityService } from './../../../services/locality/locality.service';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Person } from '../../../models/person.model';
import { PersonService } from '../../../services/service.index';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Locality } from './../../../models/locality.model';
import { Department } from '../../../models/departament.model';
import { Province } from '../../../models/province.model';
import { ProvinceService } from '../../../services/province/province.service';
import { Position } from '../../../models/position.model';
import { Employee } from '../../../models/employee.model';
import { EmployeeService } from '../../../services/employee/employee.service';

import * as moment from 'moment';
// import { defineLocale } from 'ngx-bootstrap/chronos';
// import { esLocale } from 'ngx-bootstrap/locale';
// defineLocale('es', esLocale);

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PersonComponent implements OnInit, OnDestroy {

  person: Person;
  id: any;
  accion = 'ALTA';
  localityId: string;
  departmentId: string;
  provinceId: string;
  jobId: string;
  localities: Locality[] = [];
  departments: Department[] = [];
  provincs: Province[] = [];
  positions: Position[] = [];
  loading = false;
  addperson = true;
  employeeid = 0;
  bsConfig = {
    containerClass: 'theme-angle',
    dateInputFormat: 'DD-MM-YYYY'
  };
  locale = 'es';
  constructor(
    public _localityService: LocalityService,
    public _departamentService: DepartmentService,
    public _provinceService: ProvinceService,
    public _jobsService: JobService,
    public _employeeSerivice: EmployeeService,
    public personService: PersonService,
    public routeActivate: ActivatedRoute,
    public router: Router,
    private _localeService: BsLocaleService
  ) {
    this._localeService.use('es');
    this.routeActivate.params.subscribe( param => {
      this.id = param['id'];
      this.person = new Person(null, null, null, null, null, null, new Date(),  null, null, null, true, this.id);
      if (this.id !== '0') {
        this.loading = true;
        this._employeeSerivice.getById(this.id).subscribe((resp: any) => {
          this.addperson = false;
          const lperson = resp.data.person;
          // console.log(resp, 'data person');
          this.loadProvinces();   
          this.loadJobs();
         // lperson.birthday = this.convertDateToString(resp.data.person.birthday);
          this.person = lperson;
          // this.person.birthday = this.convertDateToString(resp.data.persona.birthday);
          if (resp.data.person.locality) {
            this.localityId = resp.data.person.localityId === null ? null : resp.data.person.locality.id;
            this.departmentId = resp.data.person.locality === null ? null : resp.data.person.locality.department.id;
            this.provinceId = resp.data.person.locality === null ? null : resp.data.person.locality.department.province.id;
            this.person.departmentId = this.departmentId;
            this.person.localityId = this.localityId;
            this.person.provinceId = this.provinceId;
            this.jobId = resp.data.job ? resp.data.job.id : null;
            this.employeeid = resp.data.id;
            this.loadDepartment(this.provinceId);
            this.loadLocalities(this.departmentId);
          }
          this.accion = 'EDICION';
          this.loading = false;
        } );
      } else {
        this.loadProvinces();
        this.loadJobs();
        // this.loadPositions();
      }

    });


   }

  ngOnInit() {
    
  }
  ngOnDestroy() {
    this.localities = null;
    this.departments = null;
    this.provincs = null;
  }
  save(form?: NgForm) {
    // console.log(form.value, 'Employee');
    
    if (form.value.id === '0') {
      this._employeeSerivice.add(form.value).subscribe((resp:any) => {
        // console.log(resp);
        this.resetForm(form);
        this.router.navigate(['person/persons']);
      });
      // this.personService.create(form.value)
      //   .subscribe((resp: any) => {
      //     console.log(resp, 'employee');
          
      //     if (resp.success) {
      //       const employee = new Employee(resp.data.id, form.value.jobId, null);
      //       this._employeeSerivice.add(employee).subscribe((emp: any) => {
      //           this.resetForm(form);
      //           this.router.navigate(['person/persons']);
      //       });
      //     } else {
      //       console.log('Se produjo un error!');

      //     }

      //   });
    } else {
      this._employeeSerivice.update(form.value).subscribe((resp: any) => {
        // console.log(resp);
        this.router.navigate(['person/persons']);
      });
      // this.personService.update(form.value)
      // .subscribe(resp => {
      //   if (resp.success) {
      //     console.log(resp);
          
      //     const employee = new Employee(resp.data.id, form.value.jobId, this.employeeid); // this.router.navigate(['person/persons']);
      //     this._employeeSerivice.update(employee).subscribe((emp: any) => {
      //         this.resetForm(form);
      //         this.router.navigate(['person/persons']);
      //     });
      //   } else {
      //     console.log('Se produjo un error!');

      //   }
      // });
    }
  }
  convertDateToString(dateToBeConverted: string) {
    return moment(dateToBeConverted, 'YYYY-MM-DD HH:mm:ss').format('DD-MMM-YYYY');
    }
  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
      // this.getUsers();
    }
  }
  loadProvinces() {
    this._provinceService.list().subscribe((resp: any) => {
      this.provincs = resp.data;
    });
  }

  loadDepartment(id: string) {
    this._departamentService.listbyProvince(id).subscribe((resp: any) => {
      this.departments = resp.data[0].departments;
      // console.log(this.departments);
    });
  }
  loadLocalities(id: string) {
    this._localityService.listbyDepartment(id).subscribe((resp: any) => {
      this.localities = resp.data[0].localities;
    });
  }

  loadJobs() {
    this._jobsService.list().subscribe((resp: any) => {
      // console.log(resp, 'jobs');
      
      this.positions = resp.data;
    });
  }
  persons() {
    this.router.navigate(['/person/persons']);
  }

}
