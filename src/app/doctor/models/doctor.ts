import { Especialidad } from '../../especialidad/models/especialidad';

export class Doctor {
    id: number;
    nombres: string;
    apellidos: string;
    especialidad: Especialidad;

    constructor(id: number = 0, nombre: string = '', apellidos: string = '', especialidad: Especialidad) {
        this.id = id;
        this.nombres = nombre;
        this.apellidos = apellidos;
        this.especialidad = especialidad;
    }
}
