import { CanActivateFn, Router } from '@angular/router';
import { UiService } from '../core/services/ui.service';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';

export const ConnectGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const uiService = inject(UiService);
  let connected = localStorage.getItem('connected');
  if (!connected) {
    router.navigate([''])
  }
  return true;
};
