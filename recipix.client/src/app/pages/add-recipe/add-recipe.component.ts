import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-add-recipe',
  standalone: false,
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.css']
})
export class AddRecipeComponent {
  isLoading = false;
  recipe = {
    title: '',
    cookingTimeMinutes: 0,
    difficulty: '',
    description: '',
    instructions: ''
  };

  imageChangedEvent: any = '';
  croppedImage: string = '';
  imageBlob: Blob | null = null;

  constructor(private http: HttpClient) { }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64!;
    fetch(this.croppedImage)
      .then(res => res.blob())
      .then(blob => this.imageBlob = blob);
  }

  submitRecipe() {
    
    if (!this.imageBlob) return;
    this.isLoading = true;
    const formData = new FormData();
    formData.append('title', this.recipe.title);
    formData.append('cookingTimeMinutes', this.recipe.cookingTimeMinutes.toString());
    formData.append('difficulty', this.recipe.difficulty);
    formData.append('description', this.recipe.description);
    formData.append('instructions', this.recipe.instructions);
    formData.append('image', this.imageBlob, 'recipe.png');

    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post('https://localhost:7001/api/recipes', formData, { headers })
      .subscribe({
        next: () => { this.isLoading = false; alert('Рецепт додано!') },
        error: err => { this.isLoading = false; console.error('Помилка при додаванні рецепта:', err) }
      });
  }
}
