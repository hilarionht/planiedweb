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
  initutions: Institution[] = [];
  display = 'none';
  intitution: Institution;
  id: any;
  closeResult: string;
  title = 'CREAR';
  formRegion: FormGroup;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
    public _initutionService: InstitutionService,
    public modalService: NgbModal,
    public router: Router
  ) {
    this.formRegion = new FormGroup({
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

}
