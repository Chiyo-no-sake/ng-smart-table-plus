import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {faSearch} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-smart-table-searchbar',
  templateUrl: './smart-table-searchbar.component.html',
  styleUrls: ['./smart-table-searchbar.component.css']
})
export class SmartTableSearchbarComponent implements OnInit {
  searchIcon = faSearch;
  @Output() searchSubmit = new EventEmitter<string>();
  @ViewChild('searchBar') searchBar: ElementRef;

  loading = false;

  constructor() { }

  ngOnInit(): void {
  }

  submitSearch(): boolean {
    this.searchSubmit.emit((this.searchBar.nativeElement as HTMLInputElement).value);
    return false;
  }

}
