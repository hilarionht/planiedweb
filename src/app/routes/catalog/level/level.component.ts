import { Level } from './../../../models/level.model';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { LevelService } from '../../../services/level/level.service';
import { FormControl,
        Validators,
        FormGroup,
        FormBuilder} from '@angular/forms';
import { Page } from '../../../models/Page';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LevelComponent implements OnInit {
  page = new Page();
  temp = [];
  prop: any;
  dir: any = '';
  loading: boolean = true;
  reorderable: boolean = true;
  swapColumns: boolean = false;
  rows = [];
  title = 'Nivel';
  level: Level;
  form: FormGroup;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(private fb: FormBuilder, public levelService: LevelService, public modalService: NgbModal) {
    this.list();
  }

  ngOnInit() {
    this.form = this.fb.group({
        id: new FormControl('0'),
        name: new FormControl('', [Validators.required])
      });
  }
  setPage(pageInfo) {
    this.page.numberPage = pageInfo.offset + 1;
    this.page.dir = this.dir;
    this.page.prop = this.prop;
    // console.log(this.page);
    this.levelService.findAll().subscribe((resp: any) => {
        // console.log(resp);
        this.rows = resp.data.entities;
        this.temp = resp.data.entities;
        this.page = resp.data;
        this.page.numberPage = resp.data.numberPage - 1;
        setTimeout(() => { this.loading = false; }, 1500);
    });
  }
  onSubmit($ev) {
    if (this.form.valid) {
      // console.log('form submitted',this.form.value );
      $ev.preventDefault();
      if (this.form.valid) {
        if (this.form.value.id === '0') {
          this.levelService.save(this.form.value).subscribe((resp: any) => {
            // console.log(resp);
            this.list();
          });
        } else {
          this.levelService.save(this.form.value).subscribe((resp: any) => {
            // console.log(resp);
            this.list();
          });
        }
      }
    } else {
      // validate all form fields
    }
  }
  save($ev,content) {
    $ev.preventDefault();
    if (this.form.valid) {
      if (this.form.value.id === '0') {
        this.levelService.save(this.form.value).subscribe((resp: any) => {
          // console.log(resp);
          this.list();
          this.modalService.dismissAll(content);
        });
      } else {
        this.levelService.save(this.form.value).subscribe((resp: any) => {
          // console.log(resp);
          this.list();
          this.modalService.dismissAll(content);
        });
      }
    }
  }
  open(content, id: number) {
    this.form = new FormGroup({
      id: new FormControl('0'),
      name: new FormControl('', [Validators.required]),
      createdAt: new FormControl(''),
      updatedAt: new FormControl('')
    });
    if (id) {
      this.levelService.findOne(id).subscribe((resp: any) => {
        this.level = resp.data;
        this.modalService.open(content).result.then();
      });
    } else {
      this.modalService.open(content).result.then();
    }
  }
  editbyid(content, id: number) {
    this.loading = true;
    if (id) {
      this.levelService.findOne(id).subscribe((resp: any) => {
        this.form.patchValue(resp.data);
        this.loading = false;
        this.modalService
          .open(content, {
            ariaLabelledBy: 'modal-basic-title',
            backdropClass: 'light-blue-backdrop'
          })
          .result.then(result => {}, reason => {});
          });
    }
  }
  confirm(pdelete, id: any) {
    this.title = 'ELIMINAR';
    this.loading = true;
    if (id) {
      this.levelService.findOne(id).subscribe((resp: any) => {
        this.level = resp.data;
        this.loading = false;
        this.modalService
            .open(pdelete, {
              ariaLabelledBy: 'modal-basic-title',
              backdropClass: 'light-blue-backdrop'
            })
            .result.then(() => {}, () => {});
      });
    }
  }
  delete(pdelete, id: number) {
    this.levelService.delete(id).subscribe((resp: any) => {
      this.setPage({ offset: 0 });
      this.modalService.dismissAll(pdelete);
    });
    
  }
  list() {
    this.loading = true;
    this.levelService.findAll().subscribe((resp: any) => {
      // console.log(resp);
      this.rows = resp.data.entities;
      this.temp = resp.data.entities;
      this.page = resp.data;
      this.page.numberPage = resp.data.numberPage - 1;
      this.loading = false;
    });
  }

}
