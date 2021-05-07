import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SmartTableComponent} from './smart-table/smart-table.component';
import {SmartTableHeadingComponent} from './smart-table-heading/smart-table-heading.component';
import {SmartTableContentComponent} from './smart-table-content/smart-table-content.component';
import {SmartTableBottomBarComponent} from './smart-table-bottom-bar/smart-table-bottom-bar.component';
import {SmartTableSearchbarComponent} from './smart-table-searchbar/smart-table-searchbar.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FormsModule} from '@angular/forms';
import { SmartTableTemplateDirective } from './smart-table-template.directive';
import { RemoteTableComponent } from './remote-table/remote-table.component';
import { LocalTableComponent } from './local-table/local-table.component';

@NgModule({
  declarations: [SmartTableComponent,
                 SmartTableHeadingComponent,
                 SmartTableContentComponent,
                 SmartTableSearchbarComponent,
                 SmartTableBottomBarComponent,
                 SmartTableTemplateDirective,
                 RemoteTableComponent,
                 LocalTableComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule
  ],
  exports: [SmartTableComponent, SmartTableTemplateDirective],
  providers: [],
})
export class SmartTableModule {
}
