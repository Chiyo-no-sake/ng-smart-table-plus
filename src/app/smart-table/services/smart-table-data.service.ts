import {SmartTableTemplateDirective} from '../smart-table-template.directive';
import {Input, TemplateRef} from '@angular/core';

export type RequestData = {
  sortEnabled: boolean;
  paginationEnabled: boolean;
  pageNumber?: number;
  pageSize?: number;
  sortHeaderName?: string;
  sortOrder?: 'asc' | 'desc';
  searchQuery?: string;
};

export type ResponseData<T> = {
  pagesNumber?: number;
  elementsNumber?: number;
  data: T[];
};

export class SmartTableDataService<T> {
  headers: string[] = [];
  getCellContent: (t: T, header: string) => string;
  onClick: (t: T) => void;
  headerTemplates: { [key: string]: TemplateRef<SmartTableTemplateDirective> } = {};
  sortEnabled = false;
  paginationEnabled = false;
  searchEnabled = false;
  responseData: ResponseData<T> = {pagesNumber: 0, data: []};

  constructor() { }
}
