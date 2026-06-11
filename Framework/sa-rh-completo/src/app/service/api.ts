import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vaga } from '../model/vaga.model';

@Injectable({
  providedIn: 'root',
})
export class Api {
  //atributo
  //endereço de conexão da api
  private apiUrl = "http://localhost:3007/vagas"

  constructor (private http: HttpClient) {}

  //métodos de conexão da API (GET, POST, PUT, DELETE)

  //get => read
  getVagas(): Observable<Vaga[]> {
    //observable => permite conexões assíncronas com a API
    return this.http.get<Vaga[]>(this.apiUrl); //conecta na api e retorna o conteúdo no vetor de vagas
  }

  //post => crate
  cadastrarVaga(vaga: Vaga) : Observable<Vaga[]> {
    return this.http.post<Vaga[]>(this.apiUrl, vaga); //passa o link de conexão e o valor da vaga
  }

  //put => update
  atualizarVaga(id:any, vaga: Vaga) : Observable<Vaga[]> {
    //para atualizar, precisa do id
    const UrlAtualizado = `${this.apiUrl}/${id}`; //http://localhost:3007/vagas/id
    return this.http.put<Vaga[]>(UrlAtualizado, vaga);
  }

  //delete - delete
  removerVaga(id:any) : Observable<Vaga[]> {
    //para deletar, precisa do id
    const urlDeletar = `${this.apiUrl}/${id}`;
    return this.http.delete<Vaga[]>(urlDeletar);
  }
}
