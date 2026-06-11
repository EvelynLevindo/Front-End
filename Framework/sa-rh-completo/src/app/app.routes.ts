import { Routes } from '@angular/router';
import { Vagas } from './view/vagas/vagas';
import { Inicio } from './view/inicio/inicio';
import { PainelVagas } from './view/painel-vagas/painel-vagas';
import { CurriculoForm } from './view/curriculo-form/curriculo-form';
import { CurriculoList } from './view/curriculo-list/curriculo-list';
import { CurriculoDetail } from './view/curriculo-detail/curriculo-detail';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'vagas', component: Vagas },
  { path: 'painel-vagas', component: PainelVagas },
  { path: 'curriculos', component: CurriculoList },
  { path: 'curriculos/novo', component: CurriculoForm },
  { path: 'curriculos/editar/:id', component: CurriculoForm },
  { path: 'meu-curriculo', component: CurriculoDetail },
];
