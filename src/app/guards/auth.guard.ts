import { CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import {User} from "../auth/models/user.model";

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
    const loggedUser = this.authService.getUserFromStorage();

    if (!loggedUser) {
      this.router.navigate(['/auth', 'login']);

      return false;
    }

    return true;
  }
}
