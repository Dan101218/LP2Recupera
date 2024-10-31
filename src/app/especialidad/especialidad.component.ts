import { Component } from '@angular/core';
import { EspecialidadService } from './services/especialidad.service';
import { MessageService } from 'primeng/api';
import { Especialidad } from './models/especialidad';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { NavegarComponent } from '../component/navegar/navegar.component';

@Component({
  selector: 'app-especialidad',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, FormsModule, InputTextModule, 
    DialogModule, ToastModule, ConfirmDialogModule, ProgressSpinnerModule, 
    SkeletonModule, NavegarComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './especialidad.component.html',
  styleUrl: './especialidad.component.css'
})
export class EspecialidadComponent {
  totalRecords: number = 0;
  cargando: boolean = false;
  especialidades: Especialidad[] = [];
  titulo: string = '';
  opc: string = '';
  especialidad = new Especialidad();
  op = 0;
  visible: boolean = false;
  nombreTemp: string = '';
  isDeleteInProgress: boolean = false;
  filtroNombre: string = '';

  constructor(
    private especialidadService: EspecialidadService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.listarEspecialidades();
  }

  filtrarEspecialidades() {
    if (this.filtroNombre) {
      return this.especialidades.filter(especialidad => 
        especialidad.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
      );
    }
    return this.especialidades;
  }

  listarEspecialidades() {
    this.especialidadService.getEspecialidades().subscribe({
      next: (data) => {
        this.especialidades = data;
        this.totalRecords = data.length;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la lista de especialidades',
        });
      },
    });
  }

  actualizarLista() {
    this.listarEspecialidades();
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Lista de especialidades actualizada' });
  }

  showDialogCreate() {
    this.titulo = 'Crear Especialidad';
    this.opc = 'Agregar';
    this.op = 0;
    this.nombreTemp = '';
    this.visible = true;
  }

  showDialogEdit(id: number) {
    this.titulo = 'Editar Especialidad';
    this.opc = 'Editar';
    this.especialidadService.getEspecialidadById(id).subscribe((data) => {
      this.especialidad = data;
      this.nombreTemp = this.especialidad.nombre;
      this.op = 1;
      this.visible = true;
    });
  }

  deleteEspecialidad(id: number) {
    this.isDeleteInProgress = true;
    this.especialidadService.deleteEspecialidad(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Especialidad eliminada',
        });
        this.isDeleteInProgress = false;
        this.listarEspecialidades();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la especialidad',
        });
      },
    });
  }

  addEspecialidad(): void {
    if (!this.nombreTemp || this.nombreTemp.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre de la especialidad no puede estar vacío',
      });
      return;
    }

    this.especialidad.nombre = this.nombreTemp;
    this.especialidadService.createEspecialidad(this.especialidad).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Especialidad registrada',
        });
        this.listarEspecialidades();
        this.op = 0;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar la especialidad',
        });
      },
    });
    this.visible = false;
  }

  editEspecialidad() {
    this.especialidadService.updateEspecialidad(this.especialidad, this.especialidad.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Especialidad editada',
        });
        this.listarEspecialidades();
        this.op = 0;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo editar la especialidad',
        });
      },
    });
    this.visible = false;
  }

  opcion(): void {
    if (this.op == 0) {
      this.addEspecialidad();
      this.limpiar();
    } else if (this.op == 1) {
      this.especialidad.nombre = this.nombreTemp;
      this.editEspecialidad();
      this.limpiar();
    } else {
      this.limpiar();
    }
  }

  limpiar() {
    this.titulo = '';
    this.opc = '';
    this.op = 0;
    this.especialidad.id = 0;
    this.especialidad.nombre = '';
  }
}
