import { Component, OnInit } from '@angular/core';
import {SmartTableDataService} from '../smart-table-data.service';

@Component({
  selector: 'app-smart-table-heading',
  templateUrl: './smart-table-heading.component.html',
  styleUrls: ['./smart-table-heading.component.css']
})
export class SmartTableHeadingComponent<T> implements OnInit {
  constructor(public tableData: SmartTableDataService<T>) { }

  ngOnInit(): void {
  }

}
