import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import { Cardapio } from './pages/cardapio/cardapio';
import { authGuard } from './guards/auth-guard';
import { Carrinho } from './pages/carrinho/carrinho';
import { Historico } from './pages/historico/historico';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login  },
  { path: 'cadastro', component: Cadastro},
  { path: 'cardapio', component: Cardapio, canActivate: [authGuard] },
  { path: 'carrinho', component: Carrinho, canActivate: [authGuard] },
  { path: 'historico', component: Historico, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }

];