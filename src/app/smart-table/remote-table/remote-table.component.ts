import {AfterViewInit, Component, ContentChildren, Input, OnDestroy, OnInit, QueryList, TemplateRef, ViewChild} from '@angular/core';
import {RequestData, ResponseData, SmartTableDataService} from '../services/smart-table-data.service';
import {Observable, Subscription} from 'rxjs';
import {SmartTableBottomBarComponent} from '../smart-table-bottom-bar/smart-table-bottom-bar.component';
import {SmartTableSearchbarComponent} from '../smart-table-searchbar/smart-table-searchbar.component';
import {SmartTableHeadingComponent} from '../smart-table-heading/smart-table-heading.component';
import {SmartTableTemplateDirective} from '../smart-table-template.directive';


@Component({
  selector: 'app-remote-table',
  templateUrl: './remote-table.component.html',
  styleUrls: ['./remote-table.component.css'],
})
export class RemoteTableComponent<T> implements OnInit, OnDestroy{
  constructor(public dataService: SmartTableDataService<T>) {

  }
  subscription: Subscription;

  @Input() requestData: RequestData;
  @Input() getData?: (requestData: RequestData) => Observable<ResponseData<T>>;

  @ViewChild(SmartTableBottomBarComponent) bottomBar: SmartTableBottomBarComponent<T>;
  @ViewChild(SmartTableSearchbarComponent) searchBar: SmartTableSearchbarComponent;
  @ViewChild(SmartTableHeadingComponent) headings: SmartTableHeadingComponent<T>;

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.getData(this.requestData).subscribe(t => this.dataService.responseData = t);
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
    this.requestData.pageNumber = 0;
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
