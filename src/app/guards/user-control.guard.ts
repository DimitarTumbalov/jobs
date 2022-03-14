import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserControlGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const loggedUser = this.authService.currentUserValue;

    if (loggedUser?.role !== 'user') {
      this.router.navigate(['/']);

      return false;
    }

    return true;
  }
}
