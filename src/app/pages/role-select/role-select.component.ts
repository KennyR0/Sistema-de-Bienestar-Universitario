import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-role-select',
  standalone: true,
  templateUrl: './role-select.component.html'
})
export class RoleSelectComponent {
  constructor(
    private readonly router: Router,
    private readonly roleService: RoleService
  ) {}

  enterAsAdmin(): void {
    this.roleService.setRole('admin');
    this.router.navigate(['/admin/dashboard']);
  }

  enterAsStudent(): void {
    this.roleService.setRole('student');
    this.router.navigate(['/estudiante/solicitudes']);
  }
}
