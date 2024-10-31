import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DoctorComponent } from "./doctor/doctor.component";
import { EspecialidadComponent } from "./especialidad/especialidad.component";
import { NavegarComponent } from "./component/navegar/navegar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DoctorComponent, EspecialidadComponent, NavegarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'examenLPNM';
}
