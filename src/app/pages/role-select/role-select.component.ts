import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FACULTY_OFFERS } from '../../data/academic-offer';
import { AuthService } from '../../services/auth.service';

type AuthMode = 'login' | 'register';

@Component({
  selector: 'app-role-select',
  standalone: true,
  templateUrl: './role-select.component.html'
})
export class RoleSelectComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  mode = signal<AuthMode>('login');
  email = signal('');
  password = signal('');
  fullName = signal('');
  faculty = signal('');
  program = signal('');
  message = signal('');
  attempted = signal(false);

  readonly facultyOffers = FACULTY_OFFERS;
  readonly isRegisterMode = computed(() => this.mode() === 'register');
  readonly availableCareers = computed(
    () => this.facultyOffers.find((offer) => offer.name === this.faculty())?.careers ?? []
  );

  constructor() {
    if (this.authService.currentUser()) {
      this.navigateAfterLogin();
    }
  }

  onInput(field: AuthTextField, value: string): void {
    this[field].set(value);
    this.message.set('');
  }

  onFacultyChange(value: string): void {
    this.faculty.set(value);
    this.program.set('');
    this.message.set('');
  }

  showLogin(): void {
    this.mode.set('login');
    this.message.set('');
    this.attempted.set(false);
  }

  showRegister(): void {
    this.mode.set('register');
    this.message.set('');
    this.attempted.set(false);
  }

  onSubmit(): void {
    this.attempted.set(true);
    this.message.set('');

    if (this.isRegisterMode()) {
      this.register();
      return;
    }

    const result = this.authService.login(this.email(), this.password());

    if (!result.success) {
      this.message.set(result.message ?? 'No se pudo iniciar sesion.');
      return;
    }

    this.navigateAfterLogin();
  }

  private register(): void {
    const result = this.authService.registerStudent({
      fullName: this.fullName(),
      email: this.email(),
      password: this.password(),
      faculty: this.faculty(),
      program: this.program()
    });

    if (!result.success) {
      this.message.set(result.message ?? 'No se pudo crear la cuenta.');
      return;
    }

    this.navigateAfterLogin();
  }

  private navigateAfterLogin(): void {
    const user = this.authService.currentUser();

    // El rol autenticado define la primera pantalla despues de login o registro.
    if (user?.role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
      return;
    }

    this.router.navigate(['/estudiante/solicitudes']);
  }
}

type AuthTextField = 'email' | 'password' | 'fullName' | 'program';
