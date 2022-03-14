import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]]
  });

  hasBeenSubmitted = false
  doesUserExist = true

  destroy$ = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(
      value => {
        if (value)

          console.log(`login new value:`)
      }
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSubmit(): void {
    this.hasBeenSubmitted = true
    this.doesUserExist = true

    // Check if data requirements are met
    if (this.formGroup.invalid)
      return;

    // 1. login request
    this.authService.login$(this.formGroup?.value).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        if (response) {
          // 2. store data, local-storage
          this.authService.storeUserData(response);

          // 3. navigate inside system
          this.router.navigate(['/']);
        } else {
          this.doesUserExist = false
          return
        }
      }
    });
  }

  onSingUpBtnClick() {
    this.router.navigate(['/auth/register']);
  }
}
