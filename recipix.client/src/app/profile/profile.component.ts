import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatarUrl: string;
}

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent  {
  profile?: UserProfile;
  constructor(private auth: AuthService, private router: Router) { }
  ngOnInit() {
    this.loadProfile();
  }
  loadProfile() {
    this.auth.getMyProfile().subscribe({
      next: (data) => {
        this.profile = data;
      },
      error: (err) => {
        console.error('Ошибка загрузки профиля', err);
      }
    });
  }
  logout() {
    this.auth.logout();
    window.location.href = '/login';
  }

  navigateToChangeAvatar() {
    this.router.navigate(['/change-avatar']);
  }
}
