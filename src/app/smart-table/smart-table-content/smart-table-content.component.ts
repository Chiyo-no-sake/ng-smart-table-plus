import {AfterViewInit, Component, Input, OnInit, TemplateRef} from '@angular/core';
import {SmartTableDataService} from '../services/smart-table-data.service';
import {SmartTableTemplateDirective} from '../smart-table-template.directive';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[app-smart-table-content]',
  templateUrl: './smart-table-content.component.html',
  styleUrls: ['./smart-table-content.component.css']
})
export class SmartTableContentComponent<T> implements OnInit, AfterViewInit{
  templateRefs: {[key: string]: TemplateRef<SmartTableTemplateDirective>} = {};

  constructor(public dataService: SmartTableDataService<T>) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      console.log(this.dataService.responseData);
    }, 5000);
  }

  ngAfterViewInit(): void {
    this.templateRefs = this.dataService.headerTemplates;
  }

}
