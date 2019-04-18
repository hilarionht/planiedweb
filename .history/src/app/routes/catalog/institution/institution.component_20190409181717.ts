import { Institution } from './../../../models/institution.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Page } from '../../../models/Page';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { InstitutionService } from '../../../services/service.index';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-institution',
  templateUrl: './institution.component.html',
  styleUrls: ['./institution.component.scss']
})
export class InstitutionComponent implements OnInit {
  page = new Page();
  rows = new Array<Institution>();
  rowsFilter = [];

  temp = [];
  provinces = [];
  initutions: Institution[] = [];
  display = 'none';
  intitution: Institution;
  id: any;
  closeResult: string;
  title = 'CREAR';
  formInst: FormGroup;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
    public _initutionService: InstitutionService,
    public modalService: NgbModal,
    public router: Router
  ) {
    this.formInst = new FormGroup({
      id: new FormControl('0'),
      name: new FormControl('', [Validators.required]),
      createdAt: new FormControl(''),
      updatedAt: new FormControl(''),
      cue: new FormControl(''),
      registration_number: new FormControl(''),
      locality_id: new FormControl(''),
      region_id: new FormControl(''),
      ambit_id: new FormControl('')
    });
    this.page.limit = 10;
  }

  ngOnInit() {
  }
  save($ev, value: any) {
    // console.log(this.formInst);

    $ev.preventDefault();
    // tslint:disable-next-line:forin
    for (const c in this.formInst.controls) {
      this.formInst.controls[c].markAsTouched();
    }
    if (this.formInst.valid) {
      if (this.formInst.value.id === '0') {
        this._initutionService.create(this.formInst.value).subscribe(resp => {
          //this.setPage({offset: 0 });
        });
      } else {
        this._initutionService.update(this.formInst.value).subscribe(resp => {
          // this.formInst.reset();
          //this.setPage({offset: 0 });
        });
      }
      this.formInst.reset();
      this.modalService.dismissAll();
      // let user = new User( value.username, value.password, null,null,null,null,null,null,null,null);
      // this._userService.login(user).subscribe(() => this.router.navigate(['/']));
    }
    //console.log(this.formInst.value);
  }
}
