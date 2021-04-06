import {Component, OnInit} from '@angular/core';
import {SmartTableDataService} from '../services/smart-table-data.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[app-smart-table-heading]',
  templateUrl: './smart-table-heading.component.html',
  styleUrls: ['./smart-table-heading.component.css'],
})
export class SmartTableHeadingComponent<T> implements OnInit {
  constructor(public tableData: SmartTableDataService<T>) {
  }

  ngOnInit(): void {
  }

}
