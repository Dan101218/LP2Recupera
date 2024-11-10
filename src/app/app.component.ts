import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotasComponent } from "./notas/notas.component";
import { CursoComponent } from "./cursos/curso.component";
import { AlumnoComponent } from "./alumnos/alumnos.component";
import { NavegarComponent } from "./component/navegar/navegar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotasComponent , CursoComponent, AlumnoComponent, NavegarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'examenLPNM';
}
