import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isSmallScreen = false;
  title = 'recipix.client';
  constructor(
    private http: HttpClient,
    private observer: BreakpointObserver,
    public auth: AuthService
  ) { }


  ngOnInit(): void {
    this.observer.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isSmallScreen = result.matches;
        console.log('Is small screen:', this.isSmallScreen); 
      });
  }
}
