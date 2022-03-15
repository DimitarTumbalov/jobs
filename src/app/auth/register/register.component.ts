import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {User} from "../models/user.model";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  formGroup: FormGroup = this.fb.group({
    role: ['user'],
    firstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
    lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
    organizationName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]]
  });

  isEmailUsed = false

  destroy$ = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
  }

  get roleFormControl(): FormControl {
    return this.formGroup?.get('role') as FormControl;
  }

  get firstNameControl(): FormControl {
    return this.formGroup?.get('firstName') as FormControl;
  }

  get lastNameFormControl(): FormControl {
    return this.formGroup?.get('lastName') as FormControl;
  }

  get organizationNameFormControl(): FormControl {
    return this.formGroup?.get('organizationName') as FormControl;
  }

  get emailFormControl(): FormControl {
    return this.formGroup?.get('email') as FormControl;
  }

  get passwordFormControl(): FormControl {
    return this.formGroup?.get('password') as FormControl;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSubmit(): void {
    let role = this.formGroup.value.role

    let user: User;

    if (role === 'user') {
      if (this.firstNameControl.invalid
        || this.lastNameFormControl.invalid
        || this.emailFormControl.invalid
        || this.passwordFormControl.invalid) {
        this.formGroup.markAllAsTouched();

        return
      }

      let email = this.formGroup.value.email

      user = {
        firstName: this.formGroup.value.firstName,
        lastName: this.formGroup.value.lastName,
        email,
        password: this.formGroup.value.password,
        role
      };
    } else {
      if (this.organizationNameFormControl.invalid
        || this.emailFormControl.invalid
        || this.passwordFormControl.invalid) {
        this.formGroup.markAllAsTouched();

        return
      }

      user = {
        organizationName: this.formGroup.value.organizationName,
        email: this.formGroup.value.email,
        password: this.formGroup.value.password,
        role
      };
    }

    this.authService.getUserByEmail$(user.email).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        if (response == null) {
          this.authService.register$(user).pipe(takeUntil(this.destroy$)).subscribe({
            next: (response) => {
              this.authService.storeUserData(response);

              // 3. navigate inside system
              this.router.navigate(['/']);
            }
          })
        } else {
          this.isEmailUsed = true
        }
      }
    });
  }
}
