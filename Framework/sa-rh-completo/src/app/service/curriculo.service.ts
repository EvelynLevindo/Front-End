import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Curriculo } from '../model/curriculo.model';

@Injectable({
  providedIn: 'root',
})
export class CurriculoService {
  private apiUrl = 'http://localhost:3007/curriculos';

  constructor(private http: HttpClient) {}

  getCurriculos(): Observable<Curriculo[]> {
    return this.http.get<Curriculo[]>(this.apiUrl);
  }

  getCurriculoById(id: number): Observable<Curriculo> {
    return this.http.get<Curriculo>(`${this.apiUrl}/${id}`);
  }

  getCurriculoByUsuarioId(usuarioId: number): Observable<Curriculo[]> {
    return this.http.get<Curriculo[]>(`${this.apiUrl}?usuarioId=${usuarioId}`);
  }

  postCurriculo(curriculo: Curriculo): Observable<Curriculo> {
    return this.http.post<Curriculo>(this.apiUrl, curriculo);
  }

  putCurriculo(curriculo: Curriculo): Observable<Curriculo> {
    const url = `${this.apiUrl}/${curriculo.id}`;
    return this.http.put<Curriculo>(url, curriculo);
  }

  deleteCurriculo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
