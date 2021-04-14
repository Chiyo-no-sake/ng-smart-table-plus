import {AfterViewInit, Component, ContentChildren, Input, OnDestroy, OnInit, QueryList, TemplateRef, ViewChild} from '@angular/core';
import {RequestData, ResponseData, SmartTableDataService} from '../services/smart-table-data.service';
import {Observable, Subscription} from 'rxjs';
import {SmartTableBottomBarComponent} from '../smart-table-bottom-bar/smart-table-bottom-bar.component';
import {SmartTableSearchbarComponent} from '../smart-table-searchbar/smart-table-searchbar.component';
import {SmartTableHeadingComponent} from '../smart-table-heading/smart-table-heading.component';
import {SmartTableTemplateDirective} from '../smart-table-template.directive';


@Component({
  selector: 'app-local-table',
  templateUrl: './local-table.component.html',
  styleUrls: ['./local-table.component.css'],
  providers: [SmartTableDataService]
})
export class LocalTableComponent<T> implements OnInit, OnDestroy{
  constructor(public dataService: SmartTableDataService<T>) {
  }

  // mandatory
  @Input() localArray?: T[];
  @Input() requestData: RequestData;

  @ViewChild(SmartTableBottomBarComponent) bottomBar: SmartTableBottomBarComponent<T>;
  @ViewChild(SmartTableSearchbarComponent) searchBar: SmartTableSearchbarComponent;
  @ViewChild(SmartTableHeadingComponent) headings: SmartTableHeadingComponent<T>;

  // @ContentChildren(SmartTableTemplateDirective) columnTemplates: QueryList<SmartTableTemplateDirective>;
  //
  // private getTemplateFor = (headerName: string): TemplateRef<SmartTableTemplateDirective> => {
  //   for (const dir of this.columnTemplates.toArray()) {
  //     if (dir.columnName === headerName) {
  //       return dir.templateRef;
  //     }
  //   }
  //   return null;
  // }

  private sort(): void {
    if (this.requestData.sortOrder === 'asc') {
      this.localArray.sort((a, b) =>
        this.dataService.getCellContent(a, this.requestData.sortHeaderName).localeCompare(
          this.dataService.getCellContent(b, this.requestData.sortHeaderName)));
    } else {
      this.localArray.sort((a, b) =>
        this.dataService.getCellContent(b, this.requestData.sortHeaderName).localeCompare(
          this.dataService.getCellContent(a, this.requestData.sortHeaderName)));
    }
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.requestData = {
      paginationEnabled: true,
      pageSize: 5,
      pageNumber: 0,
      sortEnabled: true,
      sortHeaderName: this.dataService.headers[2],
      sortOrder: 'asc'
    };
  }

  onPageChanged(pageSelected: number): void {
    this.requestData.pageNumber = pageSelected;
    this.bottomBar.loading = true;
    // TODO: change page && re-display items
    // this.dataService.responseData.pagesNumber;
    // this.dataService.responseData.elementsNumber;
    this.bottomBar.loading = false;
  }

  onRowsPerPageChanged(rowsPerPage: number): void {
    this.requestData.pageNumber = 0;
    this.requestData.pageSize = rowsPerPage;
    this.bottomBar.loading = true;
    // TODO: onPageChanged
    this.bottomBar.loading = false;
  }

  onSearchSubmit(keywords: string): void {
    this.requestData.pageNumber = 0;
    this.requestData.searchQuery = keywords;
    this.searchBar.loading = true;
    // TODO: onSearch
    this.searchBar.loading = false;
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
      this.sort();
    }
    this.headings.loading = false;
  }


}
