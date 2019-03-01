import { Component, OnInit } from '@angular/core';
import { ProvinceService } from '../../../services/province/province.service';
import { load } from '@angular/core/src/render3';

@Component({
  selector: 'app-paging-client',
  templateUrl: './paging-client.component.html',
  styleUrls: ['./paging-client.component.scss']
})
export class PagingClientComponent implements OnInit {
  rows = [];
  constructor(public provinceService: ProvinceService) {
    this.load();
   }

  ngOnInit() {
  }
  load()  {
    this.provinceService.list().subscribe(
      (resp: any) => {
      this.rows = resp;
      }
    );
  }
}
