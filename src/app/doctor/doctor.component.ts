import { Component } from '@angular/core';
import { DoctorService } from './services/doctor.service';
import { Doctor } from './models/doctor';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Especialidad } from '../especialidad/models/especialidad';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EspecialidadService } from '../especialidad/services/especialidad.service';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { NavegarComponent } from '../component/navegar/navegar.component';


@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [TableModule, ToastModule, FormsModule, DialogModule, ButtonModule, InputTextModule, ConfirmDialogModule, DropdownModule, CommonModule, NavegarComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css'
})
export class DoctorComponent {
  totalRecords: number = 0;
  cargando: boolean = false;
  doctores: Doctor[] = [];
  titulo: string = '';
  opc: string = '';
  doctor = new Doctor(0, '', '', new Especialidad());
  op = 0;
  visible: boolean = false;
  nombreTemp: string = '';
  apellidosTemp: string = '';
  isDeleteInProgress: boolean = false;
  filtroNombre: string = '';
  especialidadOptions: Especialidad[] = [];
  especialidadOriginal: string = '';

  constructor(
    private doctorService: DoctorService,
    private especialidadService: EspecialidadService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.cargando = true;
    this.listarDoctores();
  }

  cargarEspecialidades() {
    this.especialidadService.getEspecialidades().subscribe({
      next: (data) => {
        this.especialidadOptions = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las especialidades'
        });
      }
    });
  }

  listarDoctores() {
    this.doctorService.getDoctores().subscribe({
      next: (data) => {
        this.doctores = data;
        this.totalRecords = data.length;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la lista de doctores',
        });
      },
    });
  }

  filtrarDoctores() {
    if (this.filtroNombre) {
      return this.doctores.filter(doctor =>
        doctor.nombres.toLowerCase().includes(this.filtroNombre.toLowerCase()) ||
        doctor.apellidos.toLowerCase().includes(this.filtroNombre.toLowerCase())
      );
    }
    return this.doctores;
  }

  actualizarLista() {
    this.listarDoctores();
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Lista de doctores actualizada' });
  }

  showDialogCreate() {
    this.cargarEspecialidades();
    this.titulo = 'Crear Doctor';
    this.opc = 'Agregar';
    this.op = 0;
    this.nombreTemp = '';
    this.apellidosTemp = '';
    this.visible = true;
    this.doctor = new Doctor(0, '', '', new Especialidad());
  }

  showDialogEdit(id: number) {
    this.cargarEspecialidades();
    this.titulo = 'Editar Doctor';
    this.opc = 'Editar';
    this.doctorService.getDoctorById(id).subscribe((data) => {
      this.doctor = data;
      this.nombreTemp = this.doctor.nombres;
      this.apellidosTemp = this.doctor.apellidos;
      this.especialidadOriginal = this.doctor.especialidad.nombre;
      this.op = 1;
      this.visible = true;
    });
  }

  deleteDoctor(id: number) {

        this.doctorService.deleteDoctor(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Correcto',
              detail: 'Doctor eliminado',
            });
            this.isDeleteInProgress = false;
            this.listarDoctores();
          },
          error: () => {
            this.isDeleteInProgress = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el doctor',
            });
          },
        });
  
  }

  addDoctor(): void {
    if (!this.nombreTemp || this.nombreTemp.trim() === '' || 
        !this.apellidosTemp || this.apellidosTemp.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Todos los campos son obligatorios',
      });
      return;
    }

    this.doctor.nombres = this.nombreTemp;
    this.doctor.apellidos = this.apellidosTemp;
    
    this.doctorService.createDoctor(this.doctor).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Doctor registrado',
        });
        this.listarDoctores();
        this.op = 0;
        this.visible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar el doctor',
        });
      },
    });
  }

  editDoctor() {
    if (!this.nombreTemp || this.nombreTemp.trim() === '' || 
        !this.apellidosTemp || this.apellidosTemp.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Todos los campos son obligatorios',
      });
      return;
    }

    if (!this.doctor.especialidad || !this.doctor.especialidad.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe seleccionar una especialidad',
      });
      return;
    }

    this.doctor.nombres = this.nombreTemp;
    this.doctor.apellidos = this.apellidosTemp;

    const doctorToUpdate = {
      id: this.doctor.id,
      nombres: this.doctor.nombres,
      apellidos: this.doctor.apellidos,
      especialidad: {
        id: this.doctor.especialidad.id,
        nombre: this.doctor.especialidad.nombre
      }
    };

    this.doctorService.updateDoctor(doctorToUpdate, this.doctor.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Doctor actualizado',
        });
        this.listarDoctores();
        this.op = 0;
        this.visible = false;
      },
      error: (error) => {
        console.error('Error al actualizar doctor:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el doctor',
        });
      },
    });
  }

  opcion(): void {
    if (this.op == 0) {
      this.addDoctor();
      this.limpiar();
    } else if (this.op == 1) {
      this.editDoctor();
      this.limpiar();
    } else {
      this.limpiar();
    }
  }

  limpiar() {
    this.titulo = '';
    this.opc = '';
    this.op = 0;
    this.doctor = new Doctor(0, '', '', new Especialidad());
    this.nombreTemp = '';
    this.apellidosTemp = '';
  }

}