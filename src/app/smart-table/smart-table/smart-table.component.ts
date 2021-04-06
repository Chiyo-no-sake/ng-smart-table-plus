import {Component, Input, OnInit} from '@angular/core';
import {SmartTableDataService} from '../smart-table-data.service';

type RequestData = {
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
  styleUrls: ['./smart-table.component.css']
})
export class SmartTableComponent<T> implements OnInit {

  constructor(private dataService: SmartTableDataService<T>) { }
  @Input() headers: string[];
  @Input() getCellContent: (t: T, header: string) => string;
  @Input() onClick: (t: T) => void;
  @Input() getData: (requestData: RequestData) => T[];
  data: T[];

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

    this.data = this.getData({
      paginationEnabled: false,
      sortEnabled: false,
    });

    this.dataService.headers = this.headers;
    this.dataService.data = this.data;
    this.dataService.getCellContent = this.getCellContent;
    this.dataService.onClick = this.onClick;
  }
}
