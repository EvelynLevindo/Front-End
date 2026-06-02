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
  private apiUrl = "http://localhost:3011/vagas";//caminho da API


  constructor(private http: HttpClient){}


  //métodos de Conexão da API (GET, POST, PUT, DELETE)

  //get - read
  getVagas(): Observable<Vaga[]> { //Observable => permite conexões assincronas com a API
    return this.http.get<Vaga[]>(this.apiUrl); // conecta na api e retorna o conteúdo no vetor de Vagas
  }

  // post - alterado para retornar uma única Vaga
  cadastrarVaga(vaga: Vaga) : Observable<Vaga> {
    return this.http.post<Vaga>(this.apiUrl, vaga); 
  }

  // put - alterado para retornar uma única Vaga
  atualizarVaga(id:any, vaga: Vaga) : Observable<Vaga> { 
    const UrlAtualizado = `${this.apiUrl}/${id}`; 
    return this.http.put<Vaga>(UrlAtualizado, vaga);
  }

  // delete - alterado para any, já que o json-server retorna um objeto vazio
  removerVaga(id:any): Observable<any>{ 
    const urlDeletar = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(urlDeletar);
  }

}
