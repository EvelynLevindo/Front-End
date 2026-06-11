import { Component, OnInit } from '@angular/core';
import { Vaga } from '../../model/vaga.model';
import { Api } from '../../service/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-painel-vagas',
  imports: [FormsModule],
  templateUrl: './painel-vagas.html',
  styleUrl: './painel-vagas.scss',
})
export class PainelVagas implements OnInit {
  // terminar de fazer o crud

  public vaga: Vaga = new Vaga(0, '', '', '', 0); // interpolação de dados do formulário
  //limpar dados do formulário

  public vagas: Vaga[] = [];
  //aramazenar as informações da API

  constructor(private _apiService: Api) {} // estabele a conexão quando a págian abrir

  ngOnInit(): void {
    this.listarVagas();
  }

  // método para Listar as Vagas (Controller)
  listarVagas(): void {
    this._apiService.getVagas().subscribe((retornaVagas) => {
      this.vagas = retornaVagas.map((e) => {
        return new Vaga(e.id, e.nome, e.foto, e.descricao, e.salario);
      }); // armazena o conteúdo retornado da API no vetor de vagas
    });
  }

  // Cadastrar Vaga
  cadastrarVaga(): void {
    this._apiService.cadastrarVaga(this.vaga).subscribe(() => {
      this.vaga = new Vaga(0, '', '', '', 0); //criar um obj vazio
      this.listarVagaUnica(this.vaga); //atualizar a vaga com as informações do formulário
      alert('Vaga Cadastrada com Sucesso!!');
    });
  }

  listarVagaUnica(vaga: Vaga) {
    //limpa ou preenche os campos do formulároa
    this.vaga = vaga;
  }

  // atualizar  Vaga
  atualizarVaga(id: any): void {
    this._apiService.atualizarVaga(id, this.vaga).subscribe(() => {
      this.vaga = new Vaga(0, '', '', '', 0); //criar um obj vazio
      this.listarVagaUnica(this.vaga); //limpa os campos do formulário
      alert('Vaga Atualizada com Sucesso!!');
    });
  }

  // Deletar Vaga
  excluirVaga(id: any): void {
    this._apiService.removerVaga(id).subscribe(() => {
      this.vaga = new Vaga(0, '', '', '', 0); //criar um obj vazio
      this.listarVagaUnica(this.vaga); //limpa os campos do formulário
      alert('Vaga Excluída com Sucesso!!');
    });
  }
}
