import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ProvinceService } from '../../../services/province/province.service';


const _clone = (d) => JSON.parse(JSON.stringify(d));

@Component({
    selector: 'app-ngxdatatable',
    templateUrl: './ngxdatatable.component.html',
    styleUrls: ['./ngxdatatable.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NgxdatatableComponent implements OnInit {

    editing = {};
    rows = [];
    provs = [];
    rowsFilter = [];
    rowsExp = [];
    rowsSort = [];
    temp = [];
    expanded: any = {};
    timeout: any;

    rowsSel = [];
    selected = [];
    columnsprovs = [
        { prop: 'id' },
        { prop: 'name', name: 'Provincia' },
        { prop: 'createdAt' , name: 'FEcha'},
        { prop: 'updatedAt' }
    ];
    columns = [
        { prop: 'name' },
        { name: 'Company' },
        { name: 'Gender' }
    ];
    columnsSort = [
        { prop: 'name' },
        { name: 'Company' },
        { name: 'Gender' }
    ];
    @ViewChild(DatatableComponent) table: DatatableComponent;
    @ViewChild('myTable') tableExp: any;

    constructor(public provinceService: ProvinceService
        ) {

        this.fetch((data) => {
            // cache our list
            this.temp = _clone(data);
            // this.provs = _clone(data);
            this.rows = _clone(data);
            this.rowsFilter = _clone(data);
            this.rowsExp = _clone(data);
            this.rowsSort = _clone(data);
            this.rowsSel = _clone(data);

        });
        this.load();
    }

    onPage(event) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            console.log('paged!', event);
        }, 100);
    }
    toggleExpandRow(row) {
        console.log('Toggled Expand Row!', row);
        this.tableExp.rowDetail.toggleExpandRow(row);
    }

    onDetailToggle(event) {
        console.log('Detail Toggled', event);
    }

    fetch(cb) {
        const req = new XMLHttpRequest();
        req.open('GET', `assets/company.json`);

        req.onload = () => {
            cb(JSON.parse(req.response));
        };

        req.send();
    }

    load() {
        this.provinceService.list().subscribe((data: any) => {
            this.provs = data.data;
            console.log(data);
        });
    }
    delete(data: any) {
        console.log(data);
        
    }
    update(data:any){
        console.log(data);
    }
    updateValue(event, cell, rowIndex) {
        console.log('inline editing rowIndex', rowIndex)
        this.editing[rowIndex + '-' + cell] = false;
        this.rows[rowIndex][cell] = event.target.value;
        this.rows = [...this.rows];
        console.log('UPDATED!', this.rows[rowIndex][cell]);
    }

    ngOnInit() {

    }

    updateFilter(event) {
        const val = event.target.value.toLowerCase();

        // filter our data
        const temp = this.temp.filter(function(d) {
            return d.name.toLowerCase().indexOf(val) !== -1 || !val;
        });

        // update the rows
        this.rowsFilter = temp;
        // Whenever the filter changes, always go back to the first page
        this.table.offset = 0;
    }

    // Selection


    onSelect({ selected }) {
        console.log('Select Event', selected, this.selected);

        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
    }

    onActivate(event) {
        console.log('Activate Event', event);
    }

}
