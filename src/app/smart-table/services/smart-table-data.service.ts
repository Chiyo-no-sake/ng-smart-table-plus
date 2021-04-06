export class SmartTableDataService<T> {
  headers: string[];
  getCellContent: (t: T, header: string) => string;
  onClick: (t: T) => void;
  data: any[];
  constructor() { }
}
