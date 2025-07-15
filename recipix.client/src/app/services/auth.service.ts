import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}


export interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatarUrl: string;  // или avatarFileName
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private apiUrl = 'https://localhost:7001/api/Auth';

  constructor(private http: HttpClient) { }

  login(data: LoginRequest): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data);
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('jwt', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('jwt');
    }
    return this.token;
  }

  logout() {
    localStorage.removeItem('jwt');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  getMyProfile(): Observable<UserProfile> {
    const token = this.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.get<UserProfile>('https://localhost:7001/api/Profile/me', { headers });
  }
}
