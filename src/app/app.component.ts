import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RequestData} from './smart-table/smart-table/smart-table.component';
import {map} from 'rxjs/operators';

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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private http: HttpClient) {
    this.posts = [];
  }

  title = 'smart-table-component-example';
  headers = ['Title', 'Description', 'Price'];
  posts: Post[];
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

  getData = (requestData: RequestData) => {
    // const arr = [{title: 'Test', description: 'TestDesc', price: 'price'}];
    // return of(arr);
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
      return this.http.get<{ content: Post[] }>(request).pipe(map(element => element.content));
    } else {
      return this.http.get<Post[]>(request);
    }
  };

  onClick = (p: Post): void => {
    console.log(`Clicked: ${p.id}`);
  };
}
