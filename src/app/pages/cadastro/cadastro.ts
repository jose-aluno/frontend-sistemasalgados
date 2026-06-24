import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-cadastro',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})
export class Cadastro {
  form: FormGroup;
  erro = signal('');
  carregando = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get nome() { return this.form.get('nome')!; }
  get email() { return this.form.get('email')!; }
  get senha() { return this.form.get('senha')!; }

  cadastrar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.erro.set('');
    this.carregando.set(true);

    const { nome, email, senha } = this.form.value;

    this.authService.cadastrar(nome, email, senha).subscribe({
      next: () => this.router.navigate(['/cardapio']),
      error: (err) => {
        this.erro.set(err.error?.erro || 'Erro ao cadastrar');
        this.carregando.set(false);
      }
    });
  }
}