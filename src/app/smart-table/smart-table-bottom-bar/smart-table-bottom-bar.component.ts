import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {RequestData, SmartTableDataService} from '../services/smart-table-data.service';

@Component({
  selector: 'app-smart-table-bottom-bar',
  templateUrl: './smart-table-bottom-bar.component.html',
  styleUrls: ['./smart-table-bottom-bar.component.css']
})
export class SmartTableBottomBarComponent<T> implements OnInit {
  @Input() requestData: RequestData;
  @Output() pageChanged = new EventEmitter<{ pageSelected: number }>();

  constructor(public dataService: SmartTableDataService<T>) {
  }

  ngOnInit(): void {
  }

  public generateRowIndices(): number[] {
    const indexes = [];
    for (let i = 0; i < this.dataService.responseData.pagesNumber; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  onPageChange(pageNumber: number): void {
    this.pageChanged.emit({
      pageSelected: pageNumber,
    });
  }
}
