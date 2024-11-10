import { Component } from '@angular/core';
import { NotasService } from './services/notas.service';
import { AlumnoService } from '../alumnos/services/alumnos.service';
import { CursoService } from '../cursos/services/curso.service';
import { Notas } from './models/notas';
import { Alumno } from '../alumnos/models/alumnos';
import { Curso } from '../cursos/models/curso';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';
import { NavegarComponent } from '../component/navegar/navegar.component';

@Component({
  selector: 'app-notas',
  standalone: true,
  imports: [DropdownModule, TableModule, ToastModule, FormsModule, DialogModule, ButtonModule, InputTextModule, ConfirmDialogModule, CommonModule, NavegarComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.css']
})
export class NotasComponent {
  totalRecords: number = 0;
  cargando: boolean = false;
  notasList: Notas[] = [];
  titulo: string = '';
  opc: string = '';
  notas = new Notas();
  op = 0;
  visible: boolean = false;
  isDeleteInProgress: boolean = false;
  filtroNombre: string = '';

  alumnoOptions: Alumno[] = [];
  cursoOptions: Curso[] = [];
  nota1Temp: number = 0;
  nota2Temp: number = 0;
  nota3Temp: number = 0;

  constructor(
    private notasService: NotasService,
    private alumnoService: AlumnoService,
    private cursoService: CursoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.cargando = true;
    this.listarNotas();
    this.cargarAlumnos();
    this.cargarCursos();
  }

  cargarAlumnos() {
    this.alumnoService.getAlumnos().subscribe({
      next: (data) => {
        this.alumnoOptions = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los alumnos'
        });
      }
    });
  }

  cargarCursos() {
    this.cursoService.getCursos().subscribe({
      next: (data) => {
        this.cursoOptions = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los cursos'
        });
      }
    });
  }
  listarNotas() {
    this.notasService.getNotas().subscribe({
      next: (data) => {
        this.notasList = data;
        this.totalRecords = data.length;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la lista de notas',
        });
      },
    });
  }

  filtrarNotas() {
    if (this.filtroNombre) {
      return this.notasList.filter(nota =>
        nota.alumno.nombres.toLowerCase().includes(this.filtroNombre.toLowerCase()) ||
        nota.curso.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
      );
    }
    return this.notasList;
  }

  actualizarLista() {
    this.listarNotas();
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Lista de notas actualizada' });
  }

  showDialogCreate() {
    this.titulo = 'Crear Notas';
    this.opc = 'Agregar';
    this.op = 0;
    this.nota1Temp = 0;
    this.nota2Temp = 0;
    this.nota3Temp = 0;
    this.visible = true;
    this.notas = new Notas();
  }

  showDialogEdit(id: number) {
    this.titulo = 'Editar Notas';
    this.opc = 'Editar';
    this.notasService.getNotasById(id).subscribe((data) => {
      this.notas = data;
      this.nota1Temp = this.notas.nota1;
      this.nota2Temp = this.notas.nota2;
      this.nota3Temp = this.notas.nota3;
      this.op = 1;
      this.visible = true;
    });
  }

  deleteNotas(id: number) {
    this.isDeleteInProgress = true;
    this.notasService.deleteNotas(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Notas eliminadas',
        });
        this.isDeleteInProgress = false;
        this.listarNotas();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar las notas',
        });
      },
    });
  }

  addNotas(): void {
    if (this.nota1Temp == null || this.nota2Temp == null || this.nota3Temp == null) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Todas las notas son obligatorias',
      });
      return;
    }

    this.notas.nota1 = this.nota1Temp;
    this.notas.nota2 = this.nota2Temp;
    this.notas.nota3 = this.nota3Temp;
    this.notas.promedio = (this.nota1Temp + this.nota2Temp + this.nota3Temp) / 3;

    this.notasService.createNotas(this.notas).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Notas registradas',
        });
        this.listarNotas();
        this.op = 0;
        this.visible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar las notas',
        });
      },
    });
  }

  editNotas() {
    if (this.nota1Temp == null || this.nota2Temp == null || this.nota3Temp == null) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Todas las notas son obligatorias',
      });
      return;
    }

    this.notas.nota1 = this.nota1Temp;
    this.notas.nota2 = this.nota2Temp;
    this.notas.nota3 = this.nota3Temp;
    this.notas.promedio = (this.nota1Temp + this.nota2Temp + this.nota3Temp) / 3;

    this.notasService.updateNotas(this.notas, this.notas.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Notas actualizadas',
        });
        this.listarNotas();
        this.op = 0;
        this.visible = false;
      },
      error: (error) => {
        console.error('Error al actualizar notas:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar las notas',
        });
      },
    });
  }

  opcion(): void {
    if (this.op == 0) {
      this.addNotas();
      this.limpiar();
    } else if (this.op == 1) {
      this.editNotas();
      this.limpiar();
    } else {
      this.limpiar();
    }
  }

  limpiar() {
    this.titulo = '';
    this.opc = '';
    this.op = 0;
    this.notas = new Notas();
    this.nota1Temp = 0;
    this.nota2Temp = 0;
    this.nota3Temp = 0;
  }
}
