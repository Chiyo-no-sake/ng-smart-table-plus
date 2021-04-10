import {AfterViewInit, Component, ContentChildren, Input, OnDestroy, OnInit, QueryList, TemplateRef, ViewChild} from '@angular/core';
import {RequestData, ResponseData, SmartTableDataService} from '../services/smart-table-data.service';
import {Observable, Subscription} from 'rxjs';
import {SmartTableBottomBarComponent} from '../smart-table-bottom-bar/smart-table-bottom-bar.component';
import {SmartTableSearchbarComponent} from '../smart-table-searchbar/smart-table-searchbar.component';
import {SmartTableHeadingComponent} from '../smart-table-heading/smart-table-heading.component';
import {SmartTableTemplateDirective} from '../smart-table-template.directive';


@Component({
  selector: 'app-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.css'],
  providers: [SmartTableDataService]
})
export class SmartTableComponent<T> implements OnInit, OnDestroy, AfterViewInit {
  constructor(public dataService: SmartTableDataService<T>) {
  }

  subscription: Subscription;

  // mandatory
  @Input() headers: string[];
  @Input() sortEnabled = false;
  @Input() paginationEnabled = false;
  @Input() searchEnabled = false;
  @Input() getCellContent: (t: T, header: string) => string;
  @Input() onClick: (t: T) => void;
  @Input() getData: (requestData: RequestData) => Observable<ResponseData<T>>;

  // optionals
  @Input() maxInactiveSidePages = 1;

  @ViewChild(SmartTableBottomBarComponent) bottomBar: SmartTableBottomBarComponent<T>;
  @ViewChild(SmartTableSearchbarComponent) searchBar: SmartTableSearchbarComponent;
  @ViewChild(SmartTableHeadingComponent) headings: SmartTableHeadingComponent<T>;

  @ContentChildren(SmartTableTemplateDirective) columnTemplates: QueryList<SmartTableTemplateDirective>;

  requestData: RequestData;

  private static checkInput(inputEl: any, inputName: string): void {
    if (inputEl === null) {
      throw new Error(`Attribute ${inputName} is required`);
    }
  }

  private getTemplateFor = (headerName: string): TemplateRef<SmartTableTemplateDirective> => {
    for (const dir of this.columnTemplates.toArray()) {
      if (dir.columnName === headerName) {
        return dir.templateRef;
      }
    }

    return null;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
    this.subscription = this.getData(this.requestData).subscribe(t => this.dataService.responseData = t);

    this.dataService.headers = this.headers;
    this.dataService.getCellContent = this.getCellContent;
    this.dataService.onClick = this.onClick;
    this.dataService.searchEnabled = this.searchEnabled;
    this.dataService.paginationEnabled = this.paginationEnabled;
    this.dataService.sortEnabled = this.sortEnabled;
  }

  ngAfterViewInit(): void {
    for (const header of this.headers) {
      this.dataService.headerTemplates[header] = this.getTemplateFor(header);
    }

    console.log('template Refs: ', this.dataService.headerTemplates);
  }

  onPageChanged(pageSelected: number): void {
    this.requestData.pageNumber = pageSelected;
    this.bottomBar.loading = true;
    this.subscription.unsubscribe();
    this.subscription = this.getData(this.requestData).subscribe(t => {
      this.dataService.responseData = t;
      this.bottomBar.loading = false;
    });
  }

  onRowsPerPageChanged(rowsPerPage: number): void {
    this.requestData.pageSize = rowsPerPage;
    this.bottomBar.loading = true;
    this.subscription.unsubscribe();
    this.subscription = this.getData(this.requestData).subscribe(t => {
      this.dataService.responseData = t;
      this.bottomBar.loading = false;
    });
  }

  onSearchSubmit(keywords: string): void {
    this.requestData.pageNumber = 0;
    this.requestData.searchQuery = keywords;
    this.searchBar.loading = true;
    this.subscription.unsubscribe();
    this.subscription = this.getData(this.requestData).subscribe(
      t => {
        this.dataService.responseData = t;
        this.searchBar.loading = false;
      }
    );
  }

  onHeaderSortChanged(headerChange: { header: string, direction: 'asc' | 'desc' | 'no-sort' }): void {
    this.headings.loading = true;
    if (headerChange.direction === 'no-sort') {
      this.requestData.sortEnabled = false;
      this.requestData.sortOrder = null;
      this.requestData.sortHeaderName = null;
    } else {
      this.requestData.sortEnabled = true;
      this.requestData.sortOrder = headerChange.direction;
      this.requestData.sortHeaderName = headerChange.header;
    }
    this.subscription.unsubscribe();

    this.subscription = this.getData(this.requestData).subscribe(
      t => {
        this.dataService.responseData = t;
        this.headings.loading = false;
      }
    );
  }

}
