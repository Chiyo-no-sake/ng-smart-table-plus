import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartTableComponent } from './smart-table/smart-table.component';


@NgModule({
  declarations: [SmartTableComponent],
  imports: [
    CommonModule
  ],
  exports: [SmartTableComponent]
})
export class SmartTableModule { }
