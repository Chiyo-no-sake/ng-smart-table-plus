import {AfterViewInit, Component, ContentChildren, Input, OnDestroy, OnInit, QueryList, TemplateRef, ViewChild} from '@angular/core';
import {RequestData, ResponseData, SmartTableDataService} from '../services/smart-table-data.service';
import {Observable, Subscription} from 'rxjs';
import {SmartTableBottomBarComponent} from '../smart-table-bottom-bar/smart-table-bottom-bar.component';
import {SmartTableSearchbarComponent} from '../smart-table-searchbar/smart-table-searchbar.component';
import {SmartTableHeadingComponent} from '../smart-table-heading/smart-table-heading.component';
import {SmartTableTemplateDirective} from '../smart-table-template.directive';


@Component({
  selector: 'app-local-table',
  templateUrl: '../table-template.component.html',
  styleUrls: ['./local-table.component.css'],
})
export class LocalTableComponent<T> implements OnInit, OnDestroy {
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

  private sort(sortOrder: 'asc' | 'desc' | 'no-sort', array: T[]): T[] {
    if (sortOrder === 'asc') {
      return array.sort((a, b) =>
        this.dataService.getCellContent(a, this.requestData.sortHeaderName) >
          this.dataService.getCellContent(b, this.requestData.sortHeaderName) ? 1 : -1);
    } else if (sortOrder === 'desc') {
      return array.sort((a, b) =>
        this.dataService.getCellContent(b, this.requestData.sortHeaderName) >
          this.dataService.getCellContent(a, this.requestData.sortHeaderName) ? 1 : -1);
    } else {
      return array;
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

    this.dataService.responseData = {
      elementsNumber: this.localArray.length,
      pagesNumber: 1,
      data: this.localArray,
    };
  }

  computeElements(): void {
    let result = this.dataService.responseData.data;
    let elementsNumber = this.dataService.responseData.elementsNumber;
    let pagesNumber = this.dataService.responseData.pagesNumber;

    if (this.requestData.searchQuery !== undefined && this.requestData.searchQuery.length !== 0) {
      result = [...this.localArray.filter((value, index) => {
        const contents = [];
        this.dataService.headers.forEach((e) => {
          contents.push(this.dataService.getCellContent(value, e));
        });
        let found = false;
        contents.forEach((e) => {
          if (e.toString().toLowerCase().includes(this.requestData.searchQuery.toLowerCase())) {
            found = true;
          }
        });
        return found;
      })];
      elementsNumber = result.length;
    } else {
      result = [...this.localArray];
      elementsNumber = this.localArray.length;
      setTimeout(() => {
        console.log('local Array:' + this.localArray);
      }, 600);
    }

    if (this.requestData) {
      console.log("before sort localArray:", this.localArray)
      result = this.sort(this.requestData.sortOrder, result);
      console.log("after sort localArray:", this.localArray)
    }

    if (this.dataService.paginationEnabled) {
      const elementsPerPage = this.requestData.pageSize;
      const selectedPage = this.requestData.pageNumber;
      result = result.slice((elementsPerPage * selectedPage), (elementsPerPage * (selectedPage + 1)));
      pagesNumber = Math.ceil(elementsNumber / elementsPerPage);
    }

    this.dataService.responseData = {elementsNumber, pagesNumber, data: result};
  }

  onPageChanged(pageSelected: number): void {
    this.requestData.pageNumber = pageSelected;
    this.bottomBar.loading = true;
    this.computeElements();
    this.bottomBar.loading = false;
  }

  onRowsPerPageChanged(rowsPerPage: number): void {
    this.requestData.pageNumber = 0;
    this.requestData.pageSize = rowsPerPage;
    this.bottomBar.loading = true;
    this.computeElements();
    this.bottomBar.loading = false;
  }

  onSearchSubmit(keywords: string): void {
    this.requestData.pageNumber = 0;
    this.requestData.searchQuery = keywords;
    this.searchBar.loading = true;
    this.computeElements();
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
    }

    this.computeElements();
    this.headings.loading = false;
  }


}
