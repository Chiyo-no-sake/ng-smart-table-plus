import {Component, Input, OnInit} from '@angular/core';
import {SmartTableDataService} from '../services/smart-table-data.service';
import {Observable} from 'rxjs';

export type RequestData = {
  sortEnabled: boolean;
  paginationEnabled: boolean;
  pageNumber?: number;
  pageSize?: number;
  sortHeaderName?: string;
  sortOrder?: string;
  searchQuery?: string;
};

@Component({
  selector: 'app-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.css'],
})
export class SmartTableComponent<T> implements OnInit {

  constructor(public dataService: SmartTableDataService<T>) {
  }

  @Input() headers: string[];
  @Input() getCellContent: (t: T, header: string) => string;
  @Input() onClick: (t: T) => void;
  @Input() getData: (requestData: RequestData) => Observable<T[]>;

  private static checkInput(inputEl: any, inputName: string): void {
    if (inputEl === null) {
      throw new Error(`Attribute ${inputName} is required`);
    }
  }

  ngOnInit(): void {
    SmartTableComponent.checkInput(this.headers, 'headers');
    SmartTableComponent.checkInput(this.getCellContent, 'getCellContent');
    SmartTableComponent.checkInput(this.onClick, 'onClick');
    SmartTableComponent.checkInput(this.getData, 'getData');

    this.getData({
      paginationEnabled: false,
      pageSize: 2,
      pageNumber: 0,
      sortEnabled: true,
      sortHeaderName: this.headers[2],
      sortOrder: 'asc'
    }).subscribe(t => this.dataService.data = t);

    this.dataService.headers = this.headers;
    this.dataService.getCellContent = this.getCellContent;
    this.dataService.onClick = this.onClick;
  }
}
