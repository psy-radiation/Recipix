import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  password = '';
  email = '';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) { }

  register() {
    this.auth.register({ username: this.username, email: this.email, password: this.password }).subscribe({
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
