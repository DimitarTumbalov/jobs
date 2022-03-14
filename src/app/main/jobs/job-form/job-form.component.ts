import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {JobsService} from "../../services/jobs.service";
import {AuthService} from "../../../auth/services/auth.service";
import {of, Subject, switchMap, takeUntil} from "rxjs";
import {Job} from "../../models/job.model";

@Component({
  selector: 'app-job-post',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss']
})
export class JobFormComponent implements OnInit {
  destroy$ = new Subject<boolean>();

  formGroup: FormGroup

  hasBeenSubmitted = false
  doesUserExist = true

  job: Job;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
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
    this.route.params.pipe(
      switchMap((params) => {
        const jobId = params['id']
        if (jobId) {
          return this.jobsService.getJob$(jobId);
        }

        this.initForm();

        return of(null);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        if (response) {
          this.job = response;

          this.initForm();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();

      return;
    }

    let currentUser = this.authService.currentUserValue;

    let jobId = null;

    if (this.job?.id)
      jobId = this.job?.id

    const job: Job = {
      id: jobId,
      userId: currentUser.id,
      title: this.formGroup.value.title,
      description: this.formGroup.value.description,
      jobTypeId: this.formGroup.value.jobTypeId,
      jobCategoryId: this.formGroup.value.jobCategoryId,
      isActive: true
    };

    let request$;

    if (job.id)
      request$ = this.jobsService.updateJob$(job);
    else
      request$ = this.jobsService.postJob$(job);


    request$.subscribe({
      next: () => {
        if (job.id)
          this.router.navigate(['/jobs', job.id]);
        else
          this.router.navigate(['/posted']);
      }
    });
  }

  private initForm(): void {
    if (this.job) {
      this.formGroup = this.fb.group({
        title: this.job?.title,
        description: this.job?.description,
        jobTypeId: this.job?.jobTypeId,
        jobCategoryId: this.job?.jobCategoryId
      });
    } else {
      this.formGroup = this.fb.group({
        title: '',
        description: '',
        jobTypeId: 1,
        jobCategoryId: 1
      });
    }
  }

}
