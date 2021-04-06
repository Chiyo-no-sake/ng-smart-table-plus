import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';

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
  title = 'smart-table-component-example';
  headers = ['Title', 'Description', 'Price'];
  posts: Post[];
  postsURI = 'http://isin03.dti.supsi.ch:81/template/bff/items?direction=desc&sort=price';

  constructor(private http: HttpClient) {}

  getCellContent(post: Post, header: string): string {
    return post[header.toLowerCase()];
  }

  getData = (requestData) => {
    this.fetchPosts();
    return this.posts;
  }

  onClick(p: Post): void {
    console.log(`Clicked: ${p.id}`);
  }

  private fetchPosts(): void {
    this.http
        .get<Post[]>(this.postsURI)
        .subscribe((posts) => {
          this.posts = posts;
        });
  }
}
