import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "../../auth/services/auth.service";
import {User} from "../../auth/models/user.model";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  formGroup: FormGroup = this.fb.group({
    role: [1],
    firstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
    lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
    organizationName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]]
  })

  currentUser: User

  user: User

  isEmailUsed = false

  destroy$ = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.currentUserValue;

    this.authService.getUser$(this.currentUser.id).pipe(takeUntil(this.destroy$))
      .subscribe(
        response => {
          this.user = response
          this.firstNameControl.setValue(response.firstName)
          this.lastNameFormControl.setValue(response.lastName)
          this.organizationNameFormControl.setValue(response.organizationName)
          this.emailFormControl.setValue(response.email)
          this.passwordFormControl.setValue(response.password)
        }
      )
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
    this.formGroup.disable()
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onEdit() {
    this.formGroup.enable()
  }

  onCancel() {
    this.formGroup.disable()
    this.firstNameControl.setValue(this.user.firstName)
    this.lastNameFormControl.setValue(this.user.lastName)
    this.organizationNameFormControl.setValue(this.user.organizationName)
    this.emailFormControl.setValue(this.user.email)
    this.passwordFormControl.setValue(this.user.password)
  }

  onSubmit(): void {
    let role = this.user.role

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
        id: this.user.id,
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
        id: this.user.id,
        organizationName: this.formGroup.value.organizationName,
        email: this.formGroup.value.email,
        password: this.formGroup.value.password,
        role: this.currentUser.role
      };
    }

    this.formGroup.disable()
    this.authService.getUserByEmail$(user.email).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        if (response == null || response.id === this.user.id) {
          this.authService.updateUser$(user).pipe(takeUntil(this.destroy$)).subscribe({
            next: (response) => {
              this.authService.storeUserData(response);
            },
            error: (response: HttpErrorResponse) => {
              this.formGroup.enable()
            }
          })
        } else {
          this.isEmailUsed = true
        }
      }
    });
  }

  onDelete() {
    this.authService.deleteUser$(this.user.id).pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.authService.logout()
        this.router.navigate(['/auth', 'login']);
      });
  }

}
