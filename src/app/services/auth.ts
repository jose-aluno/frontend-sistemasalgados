import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class Auth {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, senha: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, senha }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('clienteId', res.clienteId);
        localStorage.setItem('nome', res.nome);
      })
    );
  }

  cadastrar(nome: string, email: string, senha: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/cadastro`, { nome, email, senha }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('clienteId', res.clienteId);
        localStorage.setItem('nome', res.nome);
      })
    );
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getNome(): string {
    return localStorage.getItem('nome') || '';
  }
}