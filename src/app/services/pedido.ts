import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';

export interface PedidoRequest {
  saborId: number;
  quantidade: number;
}

export interface PedidoResponse {
  id: number;
  sabor: string;
  quantidade: number;
  valorTotal: number;
  status: string;
  dataPedido: string;
}

export interface HistoricoResponse {
  cliente: string;
  totalPedidos: number;
  totalGasto: number;
  pedidos: PedidoResponse[];
}

@Injectable({ providedIn: 'root' })
export class Pedido {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  realizar(saborId: number, quantidade: number) {
    return this.http.post<PedidoResponse>(`${this.apiUrl}/pedidos`, { saborId, quantidade });
  }

  historico() {
    return this.http.get<HistoricoResponse>(`${this.apiUrl}/pedidos/historico`);
  }

  estornar(pedidoId: number) {
    return this.http.delete<PedidoResponse>(`${this.apiUrl}/pedidos/${pedidoId}/estornar`);
  }
}