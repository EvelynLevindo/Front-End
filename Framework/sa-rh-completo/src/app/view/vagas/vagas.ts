import { Component, OnInit } from '@angular/core';
import { Api } from '../../service/api';
import { Vaga } from '../../model/vaga.model';

@Component({
  selector: 'app-vagas',
  imports: [],
  templateUrl: './vagas.html',
  styleUrl: './vagas.scss',
})
export class Vagas implements OnInit {
  //atributos
  //vetor para armazenar as vagas
  public vagas: Vaga[] = [];

  constructor(private _apiService: Api) {} //estabelece conexão com a API quando abre página

  ngOnInit(): void {
    this.listarVagas();
  }

  //método para listar as vagas
  listarVagas(): void{
    this._apiService.getVagas().subscribe((retornaVagas) => {
      this.vagas = retornaVagas.map((e) => {
        return new Vaga(e.id, e.nome, e.foto, e.descricao, e.salario);
      });
    });
  }
}
