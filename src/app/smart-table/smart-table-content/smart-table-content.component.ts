import {Component, Input, OnInit} from '@angular/core';
import {SmartTableDataService} from '../services/smart-table-data.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[app-smart-table-content]',
  templateUrl: './smart-table-content.component.html',
  styleUrls: ['./smart-table-content.component.css']
})
export class SmartTableContentComponent<T> implements OnInit {

  constructor(public dataService: SmartTableDataService<T>) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      console.log(this.dataService.data);
    }, 5000);
  }


}
