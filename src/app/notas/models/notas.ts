// notas/models/notas.ts
import { Alumno } from '../../alumnos/models/alumnos';
import { Curso } from '../../cursos/models/curso';

export class Notas {
    id: number;
    alumno: Alumno; // Relación con Alumno
    curso: Curso;   // Relación con Curso
    nota1: number;
    nota2: number;
    nota3: number;
    promedio: number;

    constructor(
        id: number = 0,
        alumno: Alumno = new Alumno(),
        curso: Curso = new Curso(),
        nota1: number = 0,
        nota2: number = 0,
        nota3: number = 0,
        promedio: number = 0
    ) {
        this.id = id;
        this.alumno = alumno;
        this.curso = curso;
        this.nota1 = nota1;
        this.nota2 = nota2;
        this.nota3 = nota3;
        this.promedio = promedio;
    }
}
