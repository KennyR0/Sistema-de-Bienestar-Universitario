import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoleService } from '../services/role.service';

export const adminGuard: CanActivateFn = () => {
  const roleService = inject(RoleService);

  if (roleService.isAdmin()) {
    return true;
  }

  return inject(Router).createUrlTree(['/']);
};

export const studentGuard: CanActivateFn = () => {
  const roleService = inject(RoleService);

  if (roleService.isStudent()) {
    return true;
  }

  return inject(Router).createUrlTree(['/']);
};
