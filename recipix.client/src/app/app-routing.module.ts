import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeGalleryComponent } from './recipe-gallery/recipe-gallery.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangeAvatarComponent } from './change-avatar/change-avatar.component';
import { AddRecipeComponent } from './pages/add-recipe/add-recipe.component';
import { RecipeDetailComponent } from './pages/recipe-detail/recipe-detail.component';




const routes: Routes = [
  { path: '', component: RecipeGalleryComponent, data: { mode: 'all' } },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'change-avatar', component: ChangeAvatarComponent },
  { path: 'add', component: AddRecipeComponent },
  { path: 'recipe/:id', component: RecipeDetailComponent },
  { path: 'liked', component: RecipeGalleryComponent, data: { mode: 'favorites' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
