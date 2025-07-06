import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngredientesService, Ingrediente } from '../../services/ingredientes.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-ingredientes',
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './ingredientes.component.html',
  styleUrls: ['./ingredientes.component.scss']
})
export class IngredientesComponent implements OnInit {
  ingredientes: Ingrediente[] = [];
  idEditando: number | null = null;

  // Valores del formulario
  pesoTemporal: number | null = null;
  unidadTemporal: string = 'kg';

  nuevoIngrediente: Ingrediente = {
    nombre: '',
    precio: 0,
    unidad: 'kg',
    peso: 0
  };

  constructor(private ingredientesService: IngredientesService) {}

  ngOnInit(): void {
    this.cargarIngredientes();
  }

  cargarIngredientes() {
    this.ingredientesService.getIngredientes().subscribe((data: Ingrediente[]) => {
      this.ingredientes = data;
      console.log('Datos cargados:', data); // ← para verificar
    });
  }

  convertirAKg(valor: number, unidad: string): number {
    switch (unidad) {
      case 'kg': return valor;
      case 'g': return valor / 1000;
      case 'mg': return valor / 1000000;
      case 'lb': return valor * 0.453592;
      case 'oz': return valor * 0.0283495;
      default: return 0;
    }
  }

  guardar() {
    if (
      !this.nuevoIngrediente.nombre ||
      this.nuevoIngrediente.precio <= 0 ||
      this.pesoTemporal == null || this.pesoTemporal <= 0
    ) {
      alert('Completa todos los campos correctamente.');
      return;
    }

    const pesoKg = parseFloat(this.convertirAKg(this.pesoTemporal, this.unidadTemporal).toFixed(3));

    const ingrediente: Ingrediente = {
      id: this.idEditando ?? undefined,
      nombre: this.nuevoIngrediente.nombre,
      precio: this.nuevoIngrediente.precio,
      unidad: 'kg',
      peso: pesoKg
    };

    console.log('Ingrediente a guardar:', ingrediente); // ← Verifica que se envía el peso

    const request$ = this.idEditando
      ? this.ingredientesService.updateIngrediente(ingrediente)
      : this.ingredientesService.addIngrediente(ingrediente);

    request$.subscribe(() => {
      this.cancelarEdicion();
      this.cargarIngredientes();
    });
  }

  editarIngrediente(ingrediente: Ingrediente) {
    this.idEditando = ingrediente.id ?? null;
    this.nuevoIngrediente = {
      nombre: ingrediente.nombre,
      precio: ingrediente.precio,
      unidad: 'kg',
      peso: ingrediente.peso ?? 0
    };
    this.pesoTemporal = ingrediente.peso ?? 0;
    this.unidadTemporal = 'kg';
  }

  cancelarEdicion() {
    this.idEditando = null;
    this.nuevoIngrediente = {
      nombre: '',
      precio: 0,
      unidad: 'kg',
      peso: 0
    };
    this.pesoTemporal = null;
    this.unidadTemporal = 'kg';
  }

  eliminarIngrediente(ingrediente: Ingrediente) {
    if (ingrediente.id) {
      this.ingredientesService.deleteIngrediente(ingrediente.id).subscribe(() => {
        this.ingredientes = this.ingredientes.filter(i => i.id !== ingrediente.id);
      });
    }
  }
}
