import { Component, ChangeDetectorRef, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navbar } from "./components/navbar/navbar";
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  mostrarNavbar = signal(false);

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      const rotasSemNavbar = ['/login', '/cadastro'];
      this.mostrarNavbar.set(!rotasSemNavbar.includes(e.urlAfterRedirects));
    });
  }
}