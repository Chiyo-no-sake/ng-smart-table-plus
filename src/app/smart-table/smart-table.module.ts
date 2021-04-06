import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartTableComponent } from './smart-table/smart-table.component';
import { SmartTableHeadingComponent } from './smart-table-heading/smart-table-heading.component';
import {SmartTableDataService} from './smart-table-data.service';

@NgModule({
  declarations: [SmartTableComponent, SmartTableHeadingComponent],
  imports: [
    CommonModule
  ],
  exports: [SmartTableComponent],
  providers: [SmartTableDataService],
})
export class SmartTableModule { }
