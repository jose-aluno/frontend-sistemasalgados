import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';

export interface Sabor {
  id: number;
  nome: string;
  preco: number;
  quantidadeEstoque: number;
  promocao: boolean;
}

@Injectable({ providedIn: 'root' })
export class Estoque {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<Sabor[]>(`${this.apiUrl}/estoque`);
  }
}