import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {JobsService} from "../services/jobs.service";
import {of, Subject, switchMap, takeUntil} from "rxjs";
import {Job} from "../models/job.model";
import {User} from "../../auth/models/user.model";
import {AuthService} from "../../auth/services/auth.service";
import {Application} from "../models/application.model";
import {Like} from "../models/like.model";
import {LikesService} from "../services/likesService";
import {ApplicationsService} from "../services/applications.service";

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {
  job: Job;

  loggedUser: User

  destroy$ = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobsService: JobsService,
    private authService: AuthService,
    private likesService: LikesService,
    private applicationsService: ApplicationsService
  ) { }

  ngOnInit(): void {
    this.loggedUser = this.authService.getUserFromStorage()

    this.route.params.pipe(
      switchMap((params) => {
        let jobId = params['id']

        if (jobId)
          return this.jobsService.getJob$(jobId);

        return of(null);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        if (response) {
          response.likedByMe = response.likes?.find(l => l.userId === this.loggedUser.id) != null;
          response.applied = response.applications?.find(c => c.userId === this.loggedUser.id) != null;

          response.applications.forEach( a => {
            this.applicationsService.getApplications$().subscribe({
              next: (response2) => {

                response2.filter(a => response.applications.find(oa => oa.id === a.id) !== null)
                response.applications = response2

                this.job = response;
              }
            })
          })
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onJobDelete(){
    this.jobsService.deleteBook$(this.job.id).subscribe({
      next: () => {
        this.router.navigate(['/jobs'])
      }
    })
  }

  onJobApply() {
    const application: Application = {
      id: null,
      jobId: this.job.id,
      userId: this.loggedUser.id,
      accepted: null
    }

    // Only create application if it doesn't exist
    this.applicationsService.getApplication$(application.jobId, application.userId).subscribe({
      next: (response) => {
        if(!response){
          this.applicationsService.postApplication$(application).subscribe({
            next: (response) => {
              this.job.applications.push(response);
              this.job.applied = true;
            }
          });
        }else{
          this.applicationsService.deleteApplication$(response.id).subscribe({
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
    const like: Like = {
      id: null,
      jobId: this.job.id,
      userId: this.loggedUser.id
    }

    this.likesService.getLike$(like.userId, like.jobId).subscribe({
      next: (response) => {
        if(!response){
          this.likesService.postLike$(like).subscribe({
            next: (response) => {
              this.job.likes.push(response);
              this.job.likedByMe = true;
            }
          });
        }else{
          this.likesService.deleteLike$(response.id).subscribe({
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

    this.applicationsService.putApplication$(application).subscribe(
    )
  }

  onAcceptApplication(application: Application) {
    application.accepted = true;

    delete application.user && application.job;

    this.applicationsService.putApplication$(application).subscribe(
    )
  }
}
