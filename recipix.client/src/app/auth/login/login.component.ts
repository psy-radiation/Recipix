import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) { }

  login() {
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.auth.setToken(res.token);
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.errorMessage = 'Ошибка логина';
      }
    });
  }
}
