import { Routes } from '@angular/router';
import { NotasComponent } from './notas/notas.component';
import { CursoComponent } from './cursos/curso.component';
import { AlumnoComponent } from './alumnos/alumnos.component';
import { NavegarComponent } from './component/navegar/navegar.component';

export const routes: Routes = [
    { 
        path: 'alumno',
        component: AlumnoComponent,
        title: 'Alumnos'
    },
    {
        path: 'cursos',
        component: CursoComponent,
        title: 'Cursos' 
    },
    {
        path: 'notas',
        component: NotasComponent,
        title: 'Notas' 
    },
    {
        path: '**',
        component: NavegarComponent,
        title: 'Navegar'
    }
];
