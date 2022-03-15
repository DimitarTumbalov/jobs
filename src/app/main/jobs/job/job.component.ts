import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {JobsService} from "../../services/jobs.service";
import {of, Subject, switchMap, takeUntil} from "rxjs";
import {Job} from "../../models/job.model";
import {User} from "../../../auth/models/user.model";
import {AuthService} from "../../../auth/services/auth.service";
import {Application} from "../../models/application.model";
import {Like} from "../../models/like.model";
import {LikesService} from "../../services/likesService";
import {ApplicationsService} from "../../services/applications.service";
import {NgbModal, NgbModalConfig} from "@ng-bootstrap/ng-bootstrap";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {
  job: Job;

  currentUser: User

  destroy$ = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobsService: JobsService,
    public authService: AuthService,
    private likesService: LikesService,
    private applicationsService: ApplicationsService,
    config: NgbModalConfig,
    private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;

    this.route.params.pipe(
      switchMap((params) => {
        let jobId = params['id']

        if (jobId)
          return this.jobsService.getJob$(jobId);

        return of(null);
      }),
      takeUntil(this.destroy$)
    ).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        if (response) {
          response.likedByMe = response.likes?.find(l => l.userId === this.currentUser.id) != null;
          response.applied = response.applications?.find(c => c.userId === this.currentUser.id) != null;
          response.accepted = response.applications.find(a => a.userId === this.currentUser.id)?.accepted;

          this.applicationsService.getApplications$().pipe(
            map((applications: Application[]) => {
              return applications.filter(a => a.jobId === response.id)
            })
          ).pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (applications: Application[]) => {
                response.applications = applications.filter(a => response.applications.find(oa => oa.id === a.id) !== null);
                this.job = response;
              }
            });
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onJobDelete() {
    this.jobsService.deleteBook$(this.job.id)
      .pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.router.navigate(['/jobs'])
      }
    })
  }

  onJobApply() {
    if (!this.currentUser) {
      this.router.navigate(['/auth', 'login']);
      return;
    }

    const application: Application = {
      id: null,
      jobId: this.job.id,
      userId: this.currentUser.id,
      accepted: null
    }

    // Only create application if it doesn't exist
    this.applicationsService.getApplication$(application.jobId, application.userId)
      .pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        if (!response) {
          this.applicationsService.postApplication$(application)
            .pipe(takeUntil(this.destroy$)).subscribe({
            next: (response) => {
              this.job.applications.push(response);
              this.job.applied = true;
            }
          });
        } else {
          this.applicationsService.deleteApplication$(response.id)
            .pipe(takeUntil(this.destroy$)).subscribe({
            next: (_) => {
              this.job.applications = this.job.applications.filter(c => c.id !== response.id)
              this.job.applied = false
            }
          });
        }
      }
    });
  }

  onJobLike() {
    if (!this.currentUser) {
      this.router.navigate(['/auth', 'login']);
      return;
    }

    const like: Like = {
      id: null,
      jobId: this.job.id,
      userId: this.currentUser.id
    }

    this.likesService.getLike$(like.userId, like.jobId)
      .pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        if (!response) {
          this.likesService.postLike$(like).pipe(takeUntil(this.destroy$)).subscribe({
            next: (response) => {
              this.job.likes.push(response);
              this.job.likedByMe = true;
            }
          });
        } else {
          this.likesService.deleteLike$(response.id).pipe(takeUntil(this.destroy$)).subscribe({
            next: (_) => {
              this.job.likes = this.job.likes.filter(l => l.id !== response.id)
              this.job.likedByMe = false
            }
          });
        }
      }
    });
  }

  onRejectApplication(application: Application) {
    application.accepted = false;

    delete application.user && application.job;

    this.applicationsService.putApplication$(application).pipe(takeUntil(this.destroy$)).subscribe(
    )
  }

  onAcceptApplication(application: Application) {
    application.accepted = true;

    delete application.user && application.job;

    this.applicationsService.putApplication$(application).pipe(takeUntil(this.destroy$)).subscribe(
    )
  }

  onJobEdit(id: number) {
    this.router.navigate(['/jobs', 'edit', id]);
  }

  openDeleteModal(deleteModal) {
    this.modalService.open(deleteModal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if (result === 'yes')
        this.onJobDelete();
    }, () => {
    });
  }
}
