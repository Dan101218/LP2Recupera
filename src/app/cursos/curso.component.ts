import { Component } from '@angular/core';
import { CursoService } from './services/curso.service';
import { MessageService } from 'primeng/api';
import { Curso } from './models/curso';
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
  selector: 'app-curso',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, FormsModule, InputTextModule, 
    DialogModule, ToastModule, ConfirmDialogModule, ProgressSpinnerModule, 
    SkeletonModule, NavegarComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.css']
})
export class CursoComponent {
  totalRecords: number = 0;
  cargando: boolean = false;
  cursos: Curso[] = [];
  titulo: string = '';
  opc: string = '';
  curso = new Curso();
  op = 0;
  visible: boolean = false;
  nombreTemp: string = '';
  isDeleteInProgress: boolean = false;
  filtroNombre: string = '';

  constructor(
    private CursoService: CursoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.listarCursos();
  }

  filtrarCursos() {
    if (this.filtroNombre) {
      return this.cursos.filter(curso => 
        curso.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
      );
    }
    return this.cursos;
  }

  listarCursos() {
    this.CursoService.getCursos().subscribe({
      next: (data) => {
        this.cursos = data;
        this.totalRecords = data.length;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la lista de cursos',
        });
      },
    });
  }

  actualizarLista() {
    this.listarCursos();
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Lista de cursos actualizada' });
  }

  showDialogCreate() {
    this.titulo = 'Crear Curso';
    this.opc = 'Agregar';
    this.op = 0;
    this.nombreTemp = '';
    this.visible = true;
  }

  showDialogEdit(id: number) {
    this.titulo = 'Editar Curso';
    this.opc = 'Editar';
    this.CursoService.getCursoById(id).subscribe((data) => {
      this.curso = data;
      this.nombreTemp = this.curso.nombre;
      this.op = 1;
      this.visible = true;
    });
  }

  deleteCurso(id: number) {
    this.isDeleteInProgress = true;
    this.CursoService.deleteCurso(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Curso eliminado',
        });
        this.isDeleteInProgress = false;
        this.listarCursos();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el curso',
        });
      },
    });
  }

  addCurso(): void {
    if (!this.nombreTemp || this.nombreTemp.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre del curso no puede estar vacío',
      });
      return;
    }

    this.curso.nombre = this.nombreTemp;
    this.CursoService.createCurso(this.curso).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Curso registrado',
        });
        this.listarCursos();
        this.op = 0;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar el curso',
        });
      },
    });
    this.visible = false;
  }

  editCurso() {
    this.CursoService.updateCurso(this.curso, this.curso.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Curso editado',
        });
        this.listarCursos();
        this.op = 0;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo editar el curso',
        });
      },
    });
    this.visible = false;
  }

  opcion(): void {
    if (this.op == 0) {
      this.addCurso();
      this.limpiar();
    } else if (this.op == 1) {
      this.curso.nombre = this.nombreTemp;
      this.editCurso();
      this.limpiar();
    } else {
      this.limpiar();
    }
  }

  limpiar() {
    this.titulo = '';
    this.opc = '';
    this.op = 0;
    this.curso.id = 0;
    this.curso.nombre = '';
  }
}
