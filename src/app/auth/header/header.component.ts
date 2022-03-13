import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isMenuCollapsed = false
  displayName = ''

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    let loggedUser = this.authService.getUserFromStorage()

    if(loggedUser.role === 'user')
      this.displayName = `${loggedUser.firstName} ${loggedUser.lastName}`
    else
      this.displayName = loggedUser.organizationName
  }

  onLogout() {
    this.authService.logout()
    this.router.navigate(['/auth', 'login'])
  }
}
