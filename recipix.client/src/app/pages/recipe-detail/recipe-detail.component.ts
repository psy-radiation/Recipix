import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
interface Recipe {
  id: number;
  title: string;
  imageUrl: string;
  difficulty: string;
  timeMinutes: number;
  description: string;
  instruction: string; 
  author: string;
  authorid: number;
  created: Date;

  likeCount?: number;
  isLikedByMe?: boolean;  
}

@Component({
  selector: 'app-recipe-detail',
  standalone: false,
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css'
})
export class RecipeDetailComponent {
  recipe: Recipe | null = null;
  errorMessage: string | null = null;
  constructor(private route: ActivatedRoute, private http: HttpClient) { }
  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    if (id) {
      this.http.get<Recipe>(`https://localhost:7001/api/Recipes/${id}`).subscribe({
        next: (data) => {
          this.recipe = {
            ...data,
            imageUrl: `https://localhost:7001${data.imageUrl}`
          };
          this.loadLikesForRecipe(this.recipe);
        },
        error: (err) => {
          console.error('Ошибка при загрузке рецепта:', err);
          this.errorMessage = 'Рецепт не найден или произошла ошибка.';
        }
      });
    } else {
      this.errorMessage = 'Некорректный ID рецепта.';
    }
    
  }
  toggleLike(recipe: Recipe) {
    const token = localStorage.getItem('jwt');
    this.http.post<{ liked: boolean }>(
      `https://localhost:7001/api/likes/${recipe.id}`,
      {},
      {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
      }
    ).subscribe(res => {
      recipe.isLikedByMe = res.liked;
      recipe.likeCount = (recipe.likeCount || 0) + (res.liked ? 1 : -1);
    });
  }

  loadLikesForRecipe(recipe: Recipe) {
    const token = localStorage.getItem('jwt');
    this.http.get<{ liked: boolean }>(`https://localhost:7001/api/likes/check/${recipe.id}`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    }).subscribe(res => {
      recipe.isLikedByMe = res.liked;
    });

    this.http.get<number>(`https://localhost:7001/api/likes/count/${recipe.id}`, { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) })
      .subscribe(count => recipe.likeCount = count);
  }
}
