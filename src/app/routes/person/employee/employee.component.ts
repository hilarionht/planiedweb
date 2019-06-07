import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import {
  InstitutionService,
  ProvinceService,
  DepartmentService,
  LocalityService,
  RegionService,
  AmbitService,
  SectorService,
  PhoneTypeService,
  PhoneService,
  EmployeeService
} from '../../../services/service.index';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { repeat } from 'rxjs/operators';
import { Locality } from '../../../models/locality.model';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  public form: FormGroup;
  public contactList: FormArray;
  public id: string;
  loading = false;
  addperson = true;
  public provinces = [];
  public departments = [];
  public localities = [];
  public phonetypes = [];
  constructor(
    public _depService: DepartmentService,
    public _provService: ProvinceService,
    public _localityService: LocalityService,
    public _initutionService: InstitutionService,
    public _regionService: RegionService,
    public _ambitService: AmbitService,
    public _sectorService: SectorService,
    public _phoneTypeService: PhoneTypeService,
    public _phoneService: PhoneService,
    public _employeeService: EmployeeService,
    public modalService: NgbModal,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private _localeService: BsLocaleService
  ) {
    this._localeService.use('es');
    this.createForm();
    activatedRoute.params.subscribe( params => {
      this.id = params['id'];
      if ( this.id !== '0' ) {
        this.loading = true;
        this._employeeService.getById(this.id).subscribe((resp: any) => {
          // console.log(resp,'person');
          for (let i = 0; i < resp.data.phones.length; i++) {
            this.addContact();
          }
          this.form.patchValue({
                person: resp.data.person !== null  ? resp.data.person : null,
                id: resp.data.id,
                phones: resp.data.phones
          });
          if (resp.data.person && resp.data.person.locality !== undefined) {
                this._localityService.listbyDepartment(resp.data.person.locality.department.id).subscribe((response: any) => {
                  this.localities = response.data[0].localities;
                });
                this._depService.listbyProvince(resp.data.person.locality.department.province.id).subscribe((response: any) => {
                  this.departments = response.data[0].departments;
                });
                this._provService.list().subscribe((response: any) => {
                  this.provinces = response.data;
                });
            }
            this.addperson = false;
        });
      }
      this.loading = false;
    });
  }

  ngOnInit() {
    this._phoneTypeService.list().subscribe( (data: any) => {
      this.phonetypes = data.data; // console.log(data);
     });
    this._provService.list().subscribe((resp: any) => {
      this.provinces = resp.data;
    });
    this.createForm();
    this.contactList = this.form.get('phones') as FormArray;
  }
  createForm() {
    this.form = this.fb.group({
      id: ['0'],
      person: this.fb.group({
        id: ['0'],
        birthday: [''],
        email: ['',[Validators.required, Validators.email]],
        firstname: ['', [Validators.required]],
        lastname: ['', [Validators.required]],
        identityDocument: ['', [Validators.required]],
        postalCode: ['', Validators.required],
        localityId: ['', Validators.required],
        departmentId: ['', Validators.required],
        provinceId: [''],
        address: ['', Validators.required],
        state: [true],
      }),
      phones: this.fb.array([])
    });
  }
setValue(data: any) {

}
  save($ev, value: any) {
    $ev.preventDefault();
    if (this.form.valid) {
      // console.log(this.form.value, 'form save');
      if (this.form.value.id === '0') {
        this._employeeService.add(this.form.value).subscribe((resp:any) => {
          this.form.reset();
          this.router.navigate(['/person/employees']);
        });
      } else {
        this._employeeService.update(this.form.value).subscribe((resp: any) => {
          this.form.reset();
          this.router.navigate(['/person/employees']);
        });
      }
    }
  }
  get firstname() { return this.form.get('firstname'); }
  get email() { return this.form.get('email'); }
  get address() { return this.form.get('address'); }
  loadDepartment(id: string) {
    this._depService.listbyProvince(id).subscribe((resp: any) => {
      this.departments = resp.data[0].departments;
    });
  }
  loadLocalities(id: string) {
    this._localityService.listbyDepartment(id).subscribe((resp: any) => {
      this.localities = resp.data[0].localities;
    });
  }
  get contactFormGroup() {
    return this.form.get('phones') as FormArray;
  }
  // contact formgroup
  createContact(): FormGroup {
    return this.fb.group({
      phoneTypeId: ['', Validators.compose([Validators.required])], // i.e Email, Phone
      number: [null, Validators.compose([Validators.required])],
      employeeId: [this.id, Validators.compose([Validators.required])],
      id: ['0', Validators.compose([])],
      phoneReferenceId: null,
      institutionId: null
    });
  }

  // add a contact form group
  addContact() {
    this.contactList.push(this.createContact());
  }
  // remove contact from group
  removeContact(index) {
    // this.contactList = this.form.get('contacts') as FormArray;
    this.contactList.removeAt(index);
  }
// get the formgroup under contacts form array
getContactsFormGroup(index): FormGroup {
  // this.contactList = this.form.get('contacts') as FormArray;
  const formGroup = this.contactList.controls[index] as FormGroup;
  return formGroup;
}
keyPress(event: any) {
  const pattern = /[0-9\+\-\ ]/;

  const inputChar = String.fromCharCode(event.charCode);
  if (event.keyCode !== 8 && !pattern.test(inputChar)) {
    event.preventDefault();
  }
}
isFieldValid(field: string) {
  return !this.form.get(field).valid && this.form.get(field).touched;
}

displayFieldCss(field: string) {
  return {
    'has-error': this.isFieldValid(field),
    'has-feedback': this.isFieldValid(field)
  };
}
}
