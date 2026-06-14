import { Injectable, signal } from '@angular/core';

export type UserRole = 'admin' | 'student' | null;

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly roleSignal = signal<UserRole>(null);

  readonly role = this.roleSignal.asReadonly();

  setRole(role: UserRole): void {
    this.roleSignal.set(role);
  }

  clearRole(): void {
    this.roleSignal.set(null);
  }

  isAdmin(): boolean {
    return this.roleSignal() === 'admin';
  }

  isStudent(): boolean {
    return this.roleSignal() === 'student';
  }
}
