import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Level } from '../../models/level.model';
import { CrudService } from '../shared/crud.service';
import { URL_SERVICIOS } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class LevelService extends CrudService <Level, number> {

  constructor(public http: HttpClient,
    public router: Router,
    public _tstrService: ToasterService) {
      super(http, URL_SERVICIOS + '/level');
    }
}
