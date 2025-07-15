import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface CommentData {
  id: number;
  text: string;
  createdAt: string;
  authorUsername: string;
  authorAvatar: string;
}

@Component({
  selector: 'app-comments',
  standalone: false,
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  @Input() recipeId!: number;

  comments: CommentData[] = [];
  newComment: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.http.get<CommentData[]>(`https://localhost:7001/api/comments/recipe/${this.recipeId}`)
      .subscribe(data => this.comments = data);
  }

  submitComment() {
    const token = localStorage.getItem('jwt');

    if (!token) {
      alert("Вы должны быть авторизованы, чтобы оставить комментарий.");
      return;
    }

    if (!this.newComment.trim()) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(`https://localhost:7001/api/comments`, {
      recipeId: this.recipeId,
      text: this.newComment
    }, { headers }).subscribe(() => {
      this.newComment = '';
      this.loadComments();
    });
  }
}
