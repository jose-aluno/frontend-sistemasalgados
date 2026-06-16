import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  form: FormGroup;
  erro = signal('');
  carregando = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() { return this.form.get('email')!; }
  get senha() { return this.form.get('senha')!; }

  login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.erro.set('');
    this.carregando.set(true);

    const { email, senha } = this.form.value;

    this.authService.login(email, senha).subscribe({
      next: () => this.router.navigate(['/cardapio']),
      error: (err) => {
        this.erro.set(err.error?.erro || 'Erro ao fazer login');
        this.carregando.set(false);
      }
    });
  }
}