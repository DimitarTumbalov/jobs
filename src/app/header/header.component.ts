import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/services/auth.service";
import {Router} from "@angular/router";
import {User} from "../auth/models/user.model";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUser: User = null;
  isMenuCollapsed = false;
  displayName = '';

  destroy$ = new Subject<boolean>();

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(
      value => {
        this.currentUser = value;

        if (this.currentUser?.role === 'user')
          this.displayName = `${this.currentUser?.firstName} ${this.currentUser?.lastName}`;
        else
          this.displayName = this.currentUser?.organizationName;
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth', 'login']);
  }
}
