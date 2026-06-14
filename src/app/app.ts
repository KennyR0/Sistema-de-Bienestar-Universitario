import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { RoleService } from './services/role.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly roleService = inject(RoleService);

  readonly role = this.roleService.role;
  readonly isAdmin = computed(() => this.role() === 'admin');
  readonly isStudent = computed(() => this.role() === 'student');

  readonly adminLinks = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Estudiantes', path: '/admin/estudiantes' },
    { label: 'Solicitudes', path: '/admin/solicitudes' },
    { label: 'Citas', path: '/admin/citas' },
    { label: 'Becas', path: '/admin/becas' },
    { label: 'Casos', path: '/admin/casos' },
    { label: 'Reportes', path: '/admin/reportes' },
    { label: 'Usuarios', path: '/admin/usuarios' }
  ];

  readonly studentLinks = [
    { label: 'Mis Solicitudes', path: '/estudiante/solicitudes' },
    { label: 'Mis Citas', path: '/estudiante/citas' },
    { label: 'Mis Becas', path: '/estudiante/becas' },
    { label: 'Nueva Solicitud', path: '/estudiante/nueva-solicitud' }
  ];

  logout(): void {
    this.roleService.clearRole();
  }
}
