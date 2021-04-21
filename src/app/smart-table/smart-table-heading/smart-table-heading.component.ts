import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {SmartTableDataService} from '../services/smart-table-data.service';
import {faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons';

type directionType = 'no-sort' | 'asc' | 'desc';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[app-smart-table-heading]',
  templateUrl: './smart-table-heading.component.html',
  styleUrls: ['./smart-table-heading.component.css']
})
export class SmartTableHeadingComponent<T> implements OnInit {
  @Output() headerSortChanged = new EventEmitter<{ header: string, direction: directionType }>();
  @Input() searchBar: TemplateRef<any>;

  faAngleUp = faAngleUp;
  faAngleDown = faAngleDown;
  headerSorted = '';
  lastClicked = '';
  loading = false;
  direction: directionType = 'no-sort';

  constructor(public tableData: SmartTableDataService<T>) {
  }

  ngOnInit(): void {
  }

  onHeaderSortRequest(headerName: string): void {
    this.lastClicked = headerName;
    if (headerName === this.headerSorted) {
      switch (this.direction) {
        case 'no-sort':
          this.direction = 'asc';
          break;
        case 'asc':
          this.direction = 'desc';
          break;
        case 'desc':
          this.direction = 'no-sort';
          this.headerSorted = '';
          break;
      }
    } else {
      this.headerSorted = headerName;
      this.direction = 'asc';
    }

    this.headerSortChanged.emit({header: this.headerSorted, direction: this.direction});
  }
}
