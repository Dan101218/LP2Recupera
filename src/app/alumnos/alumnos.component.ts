import { Component } from '@angular/core';
import { AlumnoService } from './services/alumnos.service';
import { MessageService } from 'primeng/api';
import { Alumno } from './models/alumnos';
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
  selector: 'app-alumno',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, FormsModule, InputTextModule, 
    DialogModule, ToastModule, ConfirmDialogModule, ProgressSpinnerModule, 
    SkeletonModule, NavegarComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css']
})
export class AlumnoComponent {
  totalRecords: number = 0;
  cargando: boolean = false;
  alumnos: Alumno[] = [];
  titulo: string = '';
  opc: string = '';
  alumno = new Alumno();
  op = 0;
  visible: boolean = false;
  nombresTemp: string = '';
  apellidosTemp: string = '';
  dniTemp: string = '';
  isDeleteInProgress: boolean = false;
  filtroNombre: string = '';

  constructor(
    private alumnoService: AlumnoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.listarAlumnos();
  }

  filtrarAlumnos() {
    if (this.filtroNombre) {
      return this.alumnos.filter(alumno => 
        alumno.nombres.toLowerCase().includes(this.filtroNombre.toLowerCase()) ||
        alumno.apellidos.toLowerCase().includes(this.filtroNombre.toLowerCase())
      );
    }
    return this.alumnos;
  }

  listarAlumnos() {
    this.alumnoService.getAlumnos().subscribe({
      next: (data) => {
        this.alumnos = data;
        this.totalRecords = data.length;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la lista de alumnos',
        });
      },
    });
  }

  actualizarLista() {
    this.listarAlumnos();
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Lista de alumnos actualizada' });
  }

  showDialogCreate() {
    this.titulo = 'Crear Alumno';
    this.opc = 'Agregar';
    this.op = 0;
    this.nombresTemp = '';
    this.apellidosTemp = '';
    this.dniTemp = '';
    this.visible = true;
  }

  showDialogEdit(id: number) {
    this.titulo = 'Editar Alumno';
    this.opc = 'Editar';
    this.alumnoService.getAlumnoById(id).subscribe((data) => {
      this.alumno = data;
      this.nombresTemp = this.alumno.nombres;
      this.apellidosTemp = this.alumno.apellidos;
      this.dniTemp = this.alumno.dni;
      this.op = 1;
      this.visible = true;
    });
  }

  deleteAlumno(id: number) {
    this.isDeleteInProgress = true;
    this.alumnoService.deleteAlumno(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Alumno eliminado',
        });
        this.isDeleteInProgress = false;
        this.listarAlumnos();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el alumno',
        });
      },
    });
  }

  addAlumno(): void {
    if (!this.nombresTemp.trim() || !this.apellidosTemp.trim() || !this.dniTemp.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Todos los campos son obligatorios',
      });
      return;
    }

    this.alumno.nombres = this.nombresTemp;
    this.alumno.apellidos = this.apellidosTemp;
    this.alumno.dni = this.dniTemp;
    this.alumnoService.createAlumno(this.alumno).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Alumno registrado',
        });
        this.listarAlumnos();
        this.op = 0;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar el alumno',
        });
      },
    });
    this.visible = false;
  }

  editAlumno() {
    this.alumno.nombres = this.nombresTemp;
    this.alumno.apellidos = this.apellidosTemp;
    this.alumno.dni = this.dniTemp;
    this.alumnoService.updateAlumno(this.alumno, this.alumno.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Alumno editado',
        });
        this.listarAlumnos();
        this.op = 0;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo editar el alumno',
        });
      },
    });
    this.visible = false;
  }

  opcion(): void {
    if (this.op == 0) {
      this.addAlumno();
      this.limpiar();
    } else if (this.op == 1) {
      this.editAlumno();
      this.limpiar();
    } else {
      this.limpiar();
    }
  }

  limpiar() {
    this.titulo = '';
    this.opc = '';
    this.op = 0;
    this.alumno.id = 0;
    this.alumno.nombres = '';
    this.alumno.apellidos = '';
    this.alumno.dni = '';
  }
}
