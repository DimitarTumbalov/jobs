import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "../../auth/services/auth.service";
import {User} from "../../auth/models/user.model";
import {HttpErrorResponse} from "@angular/common/http";
import {NgbModal, NgbModalConfig} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  formGroup: FormGroup

  currentUser: User

  user: User

  isEmailUsed = false

  destroy$ = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    config: NgbModalConfig,
    private modalService: NgbModal) {

    config.backdrop = 'static';
    config.keyboard = false;

    this.currentUser = this.authService.currentUserValue;

    this.authService.getUser$(this.currentUser.id).pipe(takeUntil(this.destroy$))
      .subscribe(
        response => {
          this.user = response;

          this.formGroup = this.fb.group({
            firstName: [response.firstName, [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
            lastName: [response.lastName, [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
            organizationName: [response.organizationName, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
            email: [response.email, [Validators.required, Validators.email]],
            password: [response.password, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]]
          });

          this.formGroup.disable();
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
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onEdit() {
    this.formGroup?.enable()
  }

  onCancel() {
    this.formGroup?.disable()
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
              this.user = user
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
    // Delete account
    this.authService.deleteUser$(this.user.id).pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.authService.logout()
        this.router.navigate(['/auth', 'login']);
      });
  }

  openDeleteModal(deleteModal) {
    this.modalService.open(deleteModal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if (result === 'yes')
        this.onDelete();
    }, () => {
    });
  }

}
