import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DomainStore } from './domain.store';

export const domainGuard: CanActivateFn = () => {
  const domain = inject(DomainStore);
  const router = inject(Router);
  return domain.hasDomain() ? true : router.createUrlTree(['/domen']);
};
