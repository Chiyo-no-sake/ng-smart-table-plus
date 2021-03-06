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

  defaultPerPageOptions: number[] = [5, 10, 25, 50, 100];

  subscription: Subscription;
  localTable: boolean;

  // mandatory
  @Input() headers: string[];
  @Input() sortOnColumn: boolean[];
  @Input() paginationEnabled = false;
  @Input() searchEnabled = false;
  @Input() getCellContent: (t: T, header: string) => string;
  @Input() onClick: (t: T) => void;
  @Input() getData?: (requestData: RequestData) => Observable<ResponseData<T>>;
  @Input() localArray?: T[];
  @Input() perPageOptions?: number[];

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

    return undefined;
  };

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    if (this.perPageOptions !== undefined && !this.paginationEnabled) {
      throw new Error(`Cannot provide perPageOptions with pagination disabled`);
    } else if (this.perPageOptions === undefined && this.paginationEnabled) {
      this.perPageOptions = this.defaultPerPageOptions;
    }
    SmartTableComponent.checkInput(this.headers, 'headers');
    SmartTableComponent.checkInput(this.getCellContent, 'getCellContent');
    SmartTableComponent.checkInput(this.onClick, 'onClick');
    if (this.localArray === undefined) {
      SmartTableComponent.checkInput(this.getData, 'getData');
      this.localTable = false;
    }
    if (this.getData === undefined) {
      SmartTableComponent.checkInput(this.localArray, 'localArray');
      this.localTable = true;
    }
    this.requestData = {
      paginationEnabled: this.paginationEnabled,
      pageSize: (this.perPageOptions === undefined) ? 2 : this.perPageOptions[0],
      pageNumber: 0,
      sortEnabled: false,
      sortOrder: 'asc'
    };

    this.dataService.headers = this.headers;
    this.dataService.getCellContent = this.getCellContent;
    this.dataService.onClick = this.onClick;
    this.dataService.searchEnabled = this.searchEnabled;
    this.dataService.paginationEnabled = this.paginationEnabled;
    this.dataService.perPageOptions = this.perPageOptions;
    this.dataService.sortOnColumn = this.sortOnColumn;
  }

  ngAfterViewInit(): void {
    for (const header of this.headers) {
      this.dataService.headerTemplates[header] = this.getTemplateFor(header);
    }

    console.log('template Refs: ', this.dataService.headerTemplates);
  }
}
