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
  templateUrl: './carrinho.html',
})
export class Carrinho implements OnInit {
  itens = signal<ItemCarrinho[]>([]);
  totalPedidos = signal<number>(0);
  carregando = signal(false);
  erro = signal('');
  sucesso = signal('');

  total = computed(() => {
    return this.itens().reduce((acc, item) => {
      return acc + this.calcularPrecoUnitario(item) * item.quantidade;
    }, 0);
  });

  constructor(
    private pedidoService: Pedido,
    public router: Router,
  ) {}

  ngOnInit() {
    const salvo = JSON.parse(localStorage.getItem('carrinho') || '[]');
    this.itens.set(salvo);

    this.pedidoService.historico().subscribe({
      next: (res: any) => {
        this.totalPedidos.set(res.totalPedidos || 0);
      },
      error: () => {
        this.totalPedidos.set(0);
      },
    });
  }

  calcularPrecoUnitario(item: ItemCarrinho): number {
    if (item.sabor.promocao) {
      return item.sabor.preco * 0.8;
    } else if (this.totalPedidos() >= 5) {
      return item.sabor.preco * 0.9;
    }
    return item.sabor.preco;
  }

  aumentar(item: ItemCarrinho) {
    if (item.quantidade < item.sabor.quantidadeEstoque) {
      this.itens.update((lista) =>
        lista.map((i) =>
          i.sabor.id === item.sabor.id ? { ...i, quantidade: i.quantidade + 1 } : i,
        ),
      );
      this.salvar();
    }
  }

  diminuir(item: ItemCarrinho) {
    if (item.quantidade > 1) {
      this.itens.update((lista) =>
        lista.map((i) =>
          i.sabor.id === item.sabor.id ? { ...i, quantidade: i.quantidade - 1 } : i,
        ),
      );
      this.salvar();
    }
  }

  remover(item: ItemCarrinho) {
    this.itens.update((lista) => lista.filter((i) => i.sabor.id !== item.sabor.id));
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

    const pedidos = this.itens().map((i) => this.pedidoService.realizar(i.sabor.id, i.quantidade));

    let concluidos = 0;
    let erros = 0;

    pedidos.forEach((pedido) => {
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
        },
      });
    });
  }
}
