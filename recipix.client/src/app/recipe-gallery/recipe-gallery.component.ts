import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface Recipe {
  id: number;
  title: string;
  imageUrl: string;
  difficulty: string;
  timeMinutes: number;
}

@Component({
  selector: 'app-recipe-gallery',
  standalone: false,
  templateUrl: './recipe-gallery.component.html',
  styleUrl: './recipe-gallery.component.css'
})
export class RecipeGalleryComponent implements OnInit {
  @Input() mode: 'all' | 'favorites' | 'mine' = 'all'; // новый параметр
  recipes: Recipe[] = [];

  constructor(private http: HttpClient, private router: Router, private auth: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.mode = data['mode'] || this.mode;
    });
    this.loadRecipes();
  }

  goToRecipe(id: number) {
    this.router.navigate(['/recipe', id]);
  }

  loadRecipes() {
    let url = '';

    switch (this.mode) {
      case 'favorites':
        url = 'https://localhost:7001/api/likes/mine';
        break;
      case 'mine':
        url = 'https://localhost:7001/api/recipes/mine';
        break;
      default:
        url = 'https://localhost:7001/api/recipes/';
        break;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth.getToken()}`);

    this.http.get<Recipe[]>(url, { headers })
      .subscribe(data => this.recipes = data);
  }
}
