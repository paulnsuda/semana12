import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngredientesService, Ingrediente } from '../../services/ingredientes.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // ✅ Importación agregada

@Component({
  standalone: true,
  selector: 'app-ingredientes',
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule // ✅ Importado para permitir [(ngModel)]
  ],
  templateUrl: './ingredientes.component.html',
  styleUrls: ['./ingredientes.component.scss']
})
export class IngredientesComponent implements OnInit {
  ingredientes: Ingrediente[] = [];
  idEditando: number | null = null;

  // ✅ Objeto para binding con ngModel
  nuevoIngrediente: Ingrediente = {
    nombre: '',
    precio: 0,
    unidad: ''
  };

  constructor(private ingredientesService: IngredientesService) {}

  ngOnInit(): void {
    this.cargarIngredientes();
  }

  cargarIngredientes() {
    this.ingredientesService.getIngredientes().subscribe((data: Ingrediente[]) => {
      this.ingredientes = data;
    });
  }

  guardar() {
    if (!this.nuevoIngrediente.nombre || this.nuevoIngrediente.precio <= 0 || !this.nuevoIngrediente.unidad) {
      return;
    }

    const ingrediente: Ingrediente = {
      id: this.idEditando ?? undefined,
      ...this.nuevoIngrediente
    };

    const request$ = this.idEditando
      ? this.ingredientesService.updateIngrediente(ingrediente)
      : this.ingredientesService.addIngrediente(ingrediente);

    request$.subscribe(() => {
      this.cancelarEdicion();
      this.cargarIngredientes();
    });
  }

  editarIngrediente(ingrediente: Ingrediente) {
    this.idEditando = ingrediente.id!;
    this.nuevoIngrediente = { ...ingrediente };
  }

  cancelarEdicion() {
    this.idEditando = null;
    this.nuevoIngrediente = { nombre: '', precio: 0, unidad: '' };
  }

  eliminarIngrediente(ingrediente: Ingrediente) {
    if (ingrediente.id) {
      this.ingredientesService.deleteIngrediente(ingrediente.id).subscribe(() => {
        this.ingredientes = this.ingredientes.filter(i => i.id !== ingrediente.id);
      });
    }
  }
}
