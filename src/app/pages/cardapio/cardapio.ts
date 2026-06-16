import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Estoque, Sabor } from '../../services/estoque';

interface ItemCarrinho {
  sabor: Sabor;
  quantidade: number;
}

@Component({
  selector: 'app-cardapio',
  imports: [CommonModule],
  templateUrl: './cardapio.html'
})
export class Cardapio implements OnInit {
  sabores = signal<Sabor[]>([]);
  carregando = signal<boolean>(true);
  erro = signal<string>('');

  constructor(
    private estoqueService: Estoque,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarCardapio();
  }

  carregarCardapio() {
    this.carregando.set(true);
    this.estoqueService.listar().subscribe({
      next: (sabores) => {
        this.sabores.set(sabores);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Erro ao carregar cardápio');
        this.carregando.set(false);
      }
    });
  }

  adicionarAoCarrinho(sabor: Sabor) {
    const carrinho: ItemCarrinho[] = JSON.parse(localStorage.getItem('carrinho') || '[]');
    const existente = carrinho.find(i => i.sabor.id === sabor.id);

    if (existente) {
      existente.quantidade++;
    } else {
      carrinho.push({ sabor, quantidade: 1 });
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    this.router.navigate(['/carrinho']);
  }
}