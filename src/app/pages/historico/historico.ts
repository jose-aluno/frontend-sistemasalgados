import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pedido, HistoricoResponse } from '../../services/pedido';

@Component({
  selector: 'app-historico',
  imports: [CommonModule],
  templateUrl: './historico.html'
})
export class Historico implements OnInit {
  historico = signal<HistoricoResponse | null>(null);
  carregando = signal<boolean>(true);
  erro = signal<string>('');

  constructor(private pedidoService: Pedido) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando.set(true);
    this.erro.set('');
    
    this.pedidoService.historico().subscribe({
      next: (response) => {
        this.historico.set(response);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Erro ao carregar histórico');
        this.carregando.set(false);
      }
    });
  }

  estornar(id: number) {
    this.pedidoService.estornar(id).subscribe({
      next: () => this.carregar(),
      error: () => this.erro.set('Erro ao estornar pedido')
    });
  }
}