import { Routes } from '@angular/router';
import { DoctorComponent } from './doctor/doctor.component';
import { EspecialidadComponent } from './especialidad/especialidad.component';
import { NavegarComponent } from './component/navegar/navegar.component';

export const routes: Routes = [
    { 
        path: 'doctor',
        component: DoctorComponent,
        title: 'Doctores'
    },
    {
        path: 'especialidades',
        component: EspecialidadComponent,
        title: 'Especialidades' 
    },
    {
        path: '**',
        component: NavegarComponent,
        title: 'Navegar'
    }
];
