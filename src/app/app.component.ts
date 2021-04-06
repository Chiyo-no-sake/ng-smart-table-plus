import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RequestData, ResponseData} from './smart-table/services/smart-table-data.service';
import {map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

type Post = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  author: string;
  type: string;
  price: number;
  location: string;
  status: string;
};

type PostsPage = {
  content: Post[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient) {
  }

  title = 'smart-table-component-example';
  headers = ['Title', 'Description', 'Price'];
  postsURI = 'http://isin03.dti.supsi.ch:81/template/bff/items';

  private static attachParam(str: string, param: string, value: string): string {
    if (!(str.endsWith('&') || str.endsWith('?'))) {
      str = str.concat('&');
    }

    return str.concat(param, '=', value);
  }

  getCellContent = (post: Post, header: string): string => {
    return post[header.toLowerCase()];
  };

  getData = (requestData: RequestData): Observable<ResponseData<Post>> => {
    const arr: Post[] = [{
        title: 'Test',
        description: 'TestDesc',
        price: 300,
        id: '1',
        date: '1',
        category: 'stuff',
        author: 'mario',
        type: 'sex',
        location: 'culo',
        status: 'open'
      }];

    // return of({pagesNumber: null, data: arr, elementsNumber: arr.length} as ResponseData<Post>);

    let query = '?';
    if (requestData.sortEnabled) {
      query = AppComponent.attachParam(query, 'sort', requestData.sortHeaderName.toLowerCase());
      query = AppComponent.attachParam(query, 'direction', requestData.sortOrder);
    }
    if (requestData.paginationEnabled) {
      query = AppComponent.attachParam(query, 'page', requestData.pageNumber.toString());
      query = AppComponent.attachParam(query, 'size', requestData.pageSize.toString());
    }

    if (requestData.searchQuery) {
      query = AppComponent.attachParam(query, 'search', requestData.searchQuery);
    }

    let request = this.postsURI;

    if (query !== '?') {
      request = request.concat(query);
    }

    if (requestData.paginationEnabled) {
      return this.http.get<PostsPage>(request).pipe(
        map(response => {
          return {pagesNumber: response.totalPages, data: response.content, elementsNumber: response.totalElements};
        }));
    } else {
      return this.http.get<Post[]>(request).pipe(map(array => {
        return {pagesNumber: null, data: array, elementsNumber: array.length};
      }));
    }
  };

  onClick = (p: Post): void => {
    console.log(`Clicked: ${p.id}`);
  };

  ngOnInit(): void {
  }
}
