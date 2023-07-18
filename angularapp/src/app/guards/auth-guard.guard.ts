import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  
  return true;
};
