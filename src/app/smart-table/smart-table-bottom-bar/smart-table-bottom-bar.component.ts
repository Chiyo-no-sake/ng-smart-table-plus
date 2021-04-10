import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RequestData, SmartTableDataService} from '../services/smart-table-data.service';

@Component({
  selector: 'app-smart-table-bottom-bar',
  templateUrl: './smart-table-bottom-bar.component.html',
  styleUrls: ['./smart-table-bottom-bar.component.css']
})
export class SmartTableBottomBarComponent<T> implements OnInit {
  @Input() requestData: RequestData;
  @Input() maxShownForSide = 1;
  @Output() pageChanged = new EventEmitter<number>();
  @Output() rowsPerPageChanged = new EventEmitter<number>();

  loading = false;
  selectedPageNumber = 0;
  placeHolderString = '-';

  constructor(public dataService: SmartTableDataService<T>) {
  }

  ngOnInit(): void {
  }

  generateRowIndices(): string[] | number[] {
    const indices = [];
    const totalPages = this.dataService.responseData.pagesNumber;
    if (totalPages <= this.maxShownForSide * 2 + 1) {
      for (let i = 1; i <= totalPages; i++) {
        indices.push(i);
      }
    } else if (this.selectedPageNumber <= this.maxShownForSide+1) {
      for (let i = 1; i <= this.maxShownForSide * 2 + 2; i++) {
        indices.push(i);
      }

      indices.push(this.placeHolderString, totalPages);
    } else if (this.selectedPageNumber >= totalPages - this.maxShownForSide - 2) {
      indices.push(1, this.placeHolderString);
      for (let i = totalPages - this.maxShownForSide * 2 -1; i <= totalPages; i++) {
        indices.push(i);
      }
    } else {
      indices.push(1, this.placeHolderString);
      for (let i = this.selectedPageNumber - this.maxShownForSide + 1; i <= this.selectedPageNumber + this.maxShownForSide + 1; i++) {
        indices.push(i);
      }
      indices.push(this.placeHolderString, totalPages);
    }

    return indices;
  }

  onRowsPerPageChange(rowsPerPage: string): void{
    // tslint:disable-next-line:radix
    this.rowsPerPageChanged.emit(parseInt(rowsPerPage));
  }

  onPageChange(pageNumber: number): void {
    this.selectedPageNumber = pageNumber;
    this.pageChanged.emit(pageNumber);
  }
}
