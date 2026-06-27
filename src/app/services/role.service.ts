import { Injectable, computed, inject } from '@angular/core';
import { AuthService } from './auth.service';

export type UserRole = 'admin' | 'student' | null;

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly authService = inject(AuthService);

  readonly role = computed<UserRole>(() => this.authService.currentUser()?.role ?? null);

  setRole(role: UserRole): void {
    if (role === null) {
      this.clearRole();
    }
  }

  clearRole(): void {
    this.authService.logout();
  }

  isAdmin(): boolean {
    return this.role() === 'admin';
  }

  isStudent(): boolean {
    return this.role() === 'student';
  }
}
