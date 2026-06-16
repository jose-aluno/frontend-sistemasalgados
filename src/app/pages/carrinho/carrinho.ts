import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Pedido } from '../../services/pedido';
import { Sabor } from '../../services/estoque';

interface ItemCarrinho {
  sabor: Sabor;
  quantidade: number;
}

@Component({
  selector: 'app-carrinho',
  imports: [CommonModule],
  templateUrl: './carrinho.html'
})
export class Carrinho implements OnInit {
  itens = signal<ItemCarrinho[]>([]);
  carregando = signal(false);
  erro = signal('');
  sucesso = signal('');

  // Computed é a forma ideal de substituir getters no padrão Signal
  total = computed(() => 
    this.itens().reduce((acc, i) => acc + i.sabor.preco * i.quantidade, 0)
  );

  constructor(
    private pedidoService: Pedido,
    public router: Router
  ) {}

  ngOnInit() {
    const salvo = JSON.parse(localStorage.getItem('carrinho') || '[]');
    this.itens.set(salvo);
  }

  aumentar(item: ItemCarrinho) {
    if (item.quantidade < item.sabor.quantidadeEstoque) {
      item.quantidade++;
      this.salvar();
    }
  }

  diminuir(item: ItemCarrinho) {
    if (item.quantidade > 1) {
      item.quantidade--;
      this.salvar();
    }
  }

  remover(item: ItemCarrinho) {
    this.itens.update(lista => lista.filter(i => i.sabor.id !== item.sabor.id));
    this.salvar();
  }

  salvar() {
    localStorage.setItem('carrinho', JSON.stringify(this.itens()));
  }

  finalizar() {
    if (this.itens().length === 0) return;

    this.carregando.set(true);
    this.erro.set('');
    this.sucesso.set('');

    const pedidos = this.itens().map(i =>
      this.pedidoService.realizar(i.sabor.id, i.quantidade)
    );

    let concluidos = 0;
    let erros = 0;

    pedidos.forEach(pedido => {
      pedido.subscribe({
        next: () => {
          concluidos++;
          if (concluidos + erros === pedidos.length) {
            this.carregando.set(false);
            if (erros === 0) {
              this.sucesso.set('Pedidos realizados com sucesso!');
              localStorage.removeItem('carrinho');
              setTimeout(() => this.router.navigate(['/historico']), 1500);
            } else {
              this.erro.set('Alguns pedidos falharam. Tente novamente.');
            }
          }
        },
        error: () => {
          erros++;
          if (concluidos + erros === pedidos.length) {
            this.carregando.set(false);
            this.erro.set('Erro ao realizar pedidos. Tente novamente.');
          }
        }
      });
    });
  }
}