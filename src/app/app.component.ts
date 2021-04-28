import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RequestData, ResponseData} from './smart-table/services/smart-table-data.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

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

type ImageResponse = {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient) {
  }


  localArrayTable3 = [{title: 'ciao', description: 'gianni', age: 12},
    {title: 'pippo', description: 'pluto', age: 23},
    {title: 'io', description: 'mi dissocio', age: 43},
    {title: 'io', description: 'mi dissocio', age: 43},
    {title: 'io', description: 'mi dissocio', age: 43},
    {title: 'io', description: 'mi dissocio', age: 43},
    {title: 'io', description: 'mi dissocio', age: 43},
    {title: 'luca', description: 'qualcuno', age: 24},
  ];

  table3headers = ['Title', 'Description', 'Age'];
  table3headersSort = [true, false, true];

  title = 'smart-table-component-example';
  table1headers = ['Title', 'Price'];
  table1headersSort = [true, true];
  postsURI = 'http://isin03.dti.supsi.ch:81/template/bff/items';

  table2headers = ['Icon', 'Title', 'URL'];
  imagesURI = 'https://jsonplaceholder.typicode.com/photos';

  table3perPageOptions = [1, 2, 3];

  private static attachParam(str: string, param: string, value: string): string {
    if (!(str.endsWith('&') || str.endsWith('?'))) {
      str = str.concat('&');
    }

    return str.concat(param, '=', value);
  }

  getCellContentTable1 = (post: Post | ImageResponse, header: string): string => {
    return post[header.toLowerCase()];
  };

  getCellContentTable3 = (post: { title: string, description: string }, header: string): string => {
    return post[header.toLowerCase()];
  };

  getTable1Data = (requestData: RequestData): Observable<ResponseData<Post>> => {
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


  onClickTable1 = (p: Post): void => {
    alert('Clicked post: ' + p.title);
  };

  onClickTable2 = (e: ImageResponse): void => {
    alert('Clicked: ' + e.title);
  };

  onClickTable3 = (e: { title: string, description: string }): void => {
    alert('Clicked: ' + e.title);
  };

  getTable2Data = (requestData: RequestData): Observable<ResponseData<ImageResponse>> => {
    return this.http.get<ImageResponse[]>(this.imagesURI)
      .pipe(map((array) => {
        return {pagesNumber: 1, elementsNumber: 10, data: array.slice(0, 10)};
      }));
  };

  ngOnInit(): void {
  }
}
