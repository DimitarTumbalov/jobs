import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {JobsService} from "../services/jobs.service";
import {AuthService} from "../../auth/services/auth.service";

@Component({
  selector: 'app-job-post',
  templateUrl: './job-post.component.html',
  styleUrls: ['./job-post.component.scss']
})
export class JobPostComponent implements OnInit {

  formGroup: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5000)]],
    jobTypeId: [1],
    jobCategoryId: [1]
  });

  hasBeenSubmitted = false
  doesUserExist = true

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private jobsService: JobsService,
    private authService: AuthService
  ) {
  }

  get titleFormControl(): FormControl {
    return this.formGroup?.get('title') as FormControl;
  }

  get descriptionFormControl(): FormControl {
    return this.formGroup?.get('description') as FormControl;
  }

  get jobTypeIdFormControl(): FormControl {
    return this.formGroup?.get('jobTypeId') as FormControl;
  }

  get jobCategoryIdFormControl(): FormControl {
    return this.formGroup?.get('jobCategoryId') as FormControl;
  }

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();

      return
    }

    let loggedUser = this.authService.getUserFromStorage()

    const job = {
      id: null,
      organizationId: loggedUser.id,
      title: this.formGroup.value.title,
      description: this.formGroup.value.description,
      jobTypeId: this.formGroup.value.jobTypeId,
      jobCategoryId: this.formGroup.value.jobCategoryId
    };

    this.jobsService.postJob$(job).subscribe({
      next: (response) => {
        this.router.navigate(['/jobs'])
      }
    });
  }

}
