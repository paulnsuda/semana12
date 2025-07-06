import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ✅ INTERFAZ ACTUALIZADA con peso y unidadPeso correctamente tipados
export interface Ingrediente {
  id?: number;
  nombre: string;
  precio: number;
  unidad?: string;
  peso?: number | null;     // ← ✅ Ajuste importante aquí
  unidadPeso?: string;
}

@Injectable({ providedIn: 'root' })
export class IngredientesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/ingredientes';

  getIngredientes(): Observable<Ingrediente[]> {
    return this.http.get<Ingrediente[]>(this.apiUrl);
  }

  addIngrediente(data: Ingrediente): Observable<Ingrediente> {
    return this.http.post<Ingrediente>(this.apiUrl, data);
  }

  deleteIngrediente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateIngrediente(ingrediente: Ingrediente): Observable<Ingrediente> {
    if (!ingrediente.id) {
      throw new Error('El ingrediente debe tener un ID para ser actualizado.');
    }

    return this.http.put<Ingrediente>(`${this.apiUrl}/${ingrediente.id}`, ingrediente);
  }
}
