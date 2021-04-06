import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SmartTableComponent} from './smart-table/smart-table.component';
import {SmartTableHeadingComponent} from './smart-table-heading/smart-table-heading.component';
import {SmartTableDataService} from './services/smart-table-data.service';
import {SmartTableContentComponent} from './smart-table-content/smart-table-content.component';

@NgModule({
  declarations: [SmartTableComponent, SmartTableHeadingComponent, SmartTableContentComponent],
  imports: [
    CommonModule
  ],
  exports: [SmartTableComponent],
  providers: [SmartTableDataService],
})
export class SmartTableModule {
}
