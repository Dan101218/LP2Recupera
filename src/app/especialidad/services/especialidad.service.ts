import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Especialidad } from '../models/especialidad';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  private apiUrl = 'http://localhost:8080/api/especialidad';

  constructor(private http: HttpClient) { }

  getEspecialidades(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(this.apiUrl);
  }

  getEspecialidadById(id: number): Observable<Especialidad> {
    return this.http.get<Especialidad>(`${this.apiUrl}/${id}`);
  }
  updateEspecialidad(especialidad: Especialidad, id:number): Observable<Especialidad> {
    return this.http.put<Especialidad>(this.apiUrl, especialidad);
  }
  deleteEspecialidad(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  createEspecialidad(especialidad: Especialidad): Observable<Especialidad> {
    return this.http.post<Especialidad>(this.apiUrl, especialidad);
  }
}
