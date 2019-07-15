import { Institution } from '../../../models/institution.model';
import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Page } from '../../../models/Page';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import {
  InstitutionService,
  ProvinceService,
  DepartmentService,
  LocalityService,
  RegionService,
  AmbitService,
  SectorService,
  PhoneTypeService,
  PhoneService
} from '../../../services/service.index';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-institution',
  templateUrl: './institution.component.html',
  styleUrls: ['./institution.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InstitutionComponent implements OnInit {
  public form: FormGroup;
  public contactList: FormArray;
  public page = new Page();
  public rows = new Array<Institution>();
  public rowsFilter = [];
  public temp = [];
  public provinces = [];
  public departments = [];
  public localities = [];
  public regions = [];
  public ambits = [];
  public sectors = [];
  public thephones = [];
  public initutions: Institution[] = [];
  public display = 'none';
  public institution: Institution;
  public id: any;
  public closeResult: string;
  public title = 'CREAR';
  public instForm: FormGroup;
  public loading = false;
  public phonetypes = [];

  @ViewChild(DatatableComponent) table: DatatableComponent;
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
    public modalService: NgbModal,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.createForm();
    activatedRoute.params.subscribe( params => {
      this.id = params['id'];
      if ( this.id !== '0' ) {
        this.getById( this.id );
      }
      this.loading = false;
    });
    this.instForm.valueChanges
        .subscribe(data => {
          // console.log(data);
        });
  }

  ngOnInit() {
    this._phoneTypeService.list().subscribe( (data: any) => {
      this.phonetypes = data.data; // console.log(data);
     });
    // this.loading = true;
    this._provService.list().subscribe((resp: any) => {
      this.provinces = resp.data;
    });
    this._regionService.getAll().subscribe((resp: any) => {
      this.regions = resp.data;
    });
    this._sectorService.list().subscribe((resp: any) => {
      this.sectors = resp.data;
    });
    this._ambitService.getAll().subscribe((resp: any) => {
      this.ambits = resp.data;
    });
    this.createForm();
    // // set contactlist to this field
    this.contactList = this.instForm.get('phones') as FormArray;
    // console.log('on init final');
  }
  createForm() {
    this.instForm = new FormGroup({
      id: new FormControl('0'),
      name: new FormControl('', [Validators.required]),
      cue: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      registrationNumber: new FormControl(''),
      localityId: new FormControl('', [Validators.required]),
      regionId: new FormControl('', [Validators.required]),
      ambitId: new FormControl('', [Validators.required]),
      sectorId: new FormControl('', [Validators.required]),
      provinceId: new FormControl('', [Validators.required]),
      departmentId : new FormControl('', [Validators.required]),
      phones: this.fb.array([])
    });
  }
  save($ev, value: any) {
    // console.log(this.instForm);
    const listphones = this.instForm.get('phones').value as FormArray;
    $ev.preventDefault();
    // tslint:disable-next-line:forin
    for (const c in this.instForm.controls) {
      this.instForm.controls[c].markAsTouched();
    }
    if (this.instForm.valid) {
      // console.log(this.instForm.value, 'form save');
      if (this.instForm.value.id === '0') {
        this._initutionService.create(this.instForm.value).subscribe(resp => {
           this.router.navigate(['/institution/institutions']);
           this.instForm.reset();
        });
      } else {
        this._initutionService.update(this.instForm.value).subscribe((resp: any) => {
          this.router.navigate(['/institution/institutions']);
          this.instForm.reset();
        });
      }
    }
  }
  savePhones(listphones: any, id: string ) {
    for (let i = 0; i < listphones.length; i++) {
      const phone = listphones[i];
      phone.institutionId = this.id;
      // console.log(this.id , 'dataid' , id , 'Phone');
      if (phone.id === '0') {
        this._phoneService.create(phone).subscribe((resph: any) => {
        });
      } else {
        this._phoneService.update(phone).subscribe( (respu: any) => {
        });
      }
    }
  }
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
  getById( id: string) {
    if (id) {
      this._initutionService
        .getById(id)
        .subscribe((resp: any) => {
          const dataForm = resp.data;
          // console.log(resp, 'data by id');
          if (dataForm.locality) {
            this._localityService.listbyDepartment(dataForm.locality.department.id).subscribe((response: any) => {
              this.localities = response.data[0].localities;
            });
            this._depService.listbyProvince(dataForm.locality.department.province.id).subscribe((response: any) => {
              this.departments = response.data[0].departments;
            });
          }
          
          this._provService.list().subscribe((response: any) => {
            this.provinces = response.data;
          });
          for (let i = 0; i < dataForm.phones.length; i++) {
            this.addContact();
          }
          this.instForm.patchValue({
            id : dataForm.id,
            name: dataForm.name,
            cue: dataForm.cue,
            address: dataForm.address,
            registrationNumber: dataForm.registrationNumber,
            regionId: dataForm.region === null ? null : dataForm.regionId,
            ambitId: dataForm.ambit === null ? null : dataForm.ambitId,
            sectorId: dataForm.sector === null ? null : dataForm.sectorId,
            localityId: dataForm.locality === null ? null : dataForm.localityId,
            departmentId: dataForm.locality == null ? null : dataForm.locality.department.id,
            provinceId: dataForm.locality == null ? null : dataForm.locality.department.province.id,
            phones: dataForm.phones
          });
        });
    }
  }

  addPhone() {
    (<FormArray>this.instForm.controls['phones']).push(
      new FormControl('', Validators.required)
    );
  }
  // returns all form groups under contacts
  get contactFormGroup() {
    return this.instForm.get('phones') as FormArray;
  }
  // contact formgroup
  createContact(): FormGroup {
    return this.fb.group({
      phoneTypeId: ['', Validators.compose([Validators.required])], // i.e Email, Phone
      number: [null, Validators.compose([Validators.required])],
      institutionId: [this.id, Validators.compose([Validators.required])],
      id: ['0', Validators.compose([])],
      phoneReferenceId: null,
      employeeId: null
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

  // triggered to change validation of value field type
  changedFieldType(index) {
    let validators = null;

    if (this.getContactsFormGroup(index).controls['type'].value === 'email') {
      validators = Validators.compose([Validators.required, Validators.email]);
    } else {
      validators = Validators.compose([
        Validators.required,
        Validators.pattern(new RegExp('^\\+[0-9]?()[0-9](\\d[0-9]{9})$')) // pattern for validating international phone number
      ]);
    }

    this.getContactsFormGroup(index).controls['value'].setValidators(
      validators
    );

    this.getContactsFormGroup(index).controls['value'].updateValueAndValidity();
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
}
