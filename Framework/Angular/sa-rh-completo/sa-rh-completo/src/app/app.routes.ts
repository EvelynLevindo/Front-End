import { Routes } from '@angular/router';
import { Vagas } from './view/vagas/vagas';
import { Inicio } from './view/inicio/inicio';
import { PainelVagas } from './view/painel-vagas/painel-vagas';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'vagas', component: Vagas },
  { path: 'painel-vagas', component: PainelVagas },
];
