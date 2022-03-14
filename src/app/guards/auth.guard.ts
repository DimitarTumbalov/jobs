import {CanLoad, Route, Router, UrlSegment} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    const currentUser = this.authService.currentUserValue

    if (!currentUser) {
      this.router.navigate(['/auth', 'login']);
      return false
    } else
      return true
  }
}
