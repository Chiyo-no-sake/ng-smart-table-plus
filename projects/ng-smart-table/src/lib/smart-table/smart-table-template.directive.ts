import {Directive, Input, OnInit, TemplateRef} from '@angular/core';

@Directive({
  selector: 'ng-template[appTableColTemplate]'
})
export class SmartTableTemplateDirective implements OnInit {
  @Input() columnName: string;

  constructor(public templateRef: TemplateRef<SmartTableTemplateDirective>) { }

  ngOnInit(): void {
    if (!this.columnName) {
      throw new Error('Must specify a column name for each column template');
    }
  }

}
