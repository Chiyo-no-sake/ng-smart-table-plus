import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {RequestData, ResponseData, SmartTableDataService} from '../services/smart-table-data.service';
import {Observable} from 'rxjs';
import {SmartTableBottomBarComponent} from '../smart-table-bottom-bar/smart-table-bottom-bar.component';
import {SmartTableSearchbarComponent} from '../smart-table-searchbar/smart-table-searchbar.component';


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
  @Input() getData: (requestData: RequestData) => Observable<ResponseData<T>>;

  @ViewChild(SmartTableBottomBarComponent) bottomBar: SmartTableBottomBarComponent<T>;
  @ViewChild(SmartTableSearchbarComponent) searchBar: SmartTableSearchbarComponent;

  requestData: RequestData;

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
    this.requestData = {
      paginationEnabled: true,
      pageSize: 5,
      pageNumber: 0,
      sortEnabled: true,
      sortHeaderName: this.headers[2],
      sortOrder: 'asc'
    };

    this.getData(this.requestData).subscribe(t => this.dataService.responseData = t);

    this.dataService.headers = this.headers;
    this.dataService.getCellContent = this.getCellContent;
    this.dataService.onClick = this.onClick;
  }

  onPageChanged(pageNumber: { pageSelected: number }): void {
    this.requestData.pageNumber = pageNumber.pageSelected - 1;
    this.bottomBar.loading = true;
    this.getData(this.requestData).subscribe(t => {
      this.dataService.responseData = t;
      this.bottomBar.loading = false;
    });
  }

  onSearchSubmit(keywords: string): void {
    this.requestData.pageNumber = 0;
    this.requestData.searchQuery = keywords;
    this.searchBar.loading = true;
    this.getData(this.requestData).subscribe(
      t => {
        this.dataService.responseData = t;
        this.searchBar.loading = false;
      }
    );
  }
}
