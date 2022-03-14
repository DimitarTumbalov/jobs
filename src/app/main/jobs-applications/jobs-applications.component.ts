import {Component, OnInit} from '@angular/core';
import {JobsService} from "../services/jobs.service";
import {Router} from "@angular/router";
import {Job} from "../models/job.model";
import {take} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {map} from "rxjs/operators";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ApplicationsService} from "../services/applications.service";
import {Application} from "../models/application.model";
import {AuthService} from "../../auth/services/auth.service";
import {LikesService} from "../services/likesService";
import {Like} from "../models/like.model";
import {User} from "../../auth/models/user.model";

@Component({
  selector: 'app-jobs-applications',
  templateUrl: './jobs-applications.component.html',
  styleUrls: ['./jobs-applications.component.scss']
})
export class JobsApplicationsComponent implements OnInit {
  jobs: Job[]

  loggedUser: User

  formGroup: FormGroup = this.fb.group({
    typeId: 0,
    categoryId: 0
  });

  constructor(
    private fb: FormBuilder,
    private jobsService: JobsService,
    private applicationsService: ApplicationsService,
    private authService: AuthService,
    private likesService: LikesService,
    private router: Router) { }

  ngOnInit(): void {
    this.loggedUser = this.authService.getUserFromStorage()

    this.getJobs()
  }

  getJobs(typeId: number = null, categoryId: number = null){
    this.jobsService.getJobs$(typeId, categoryId).pipe(
      map((response:  Job[]) => {
        response.sort((a, b) => {
          if (a.title < b.title) {
            return -1;
          }

          if (a.title > b.title) {
            return 1;
          }

          return 0;
        });

        response.forEach( job => {
            job.likedByMe = job.likes.find(l => l.userId === this.loggedUser.id) != null;
            job.applied = job.applications.find(c => c.userId === this.loggedUser.id) != null;
          }
        )

        return response.filter(j => j.applied === true)
      }),
      take(1)
    ).subscribe({
      next: (response: Job[]) => {
        this.jobs = response;
      }
    });
  }

  onChangeFilter() {
    let categoryId = this.formGroup.value.categoryId;
    let _categoryId = categoryId;

    if(categoryId === 0)
      _categoryId = null;

    let typeId = this.formGroup.value.typeId;
    let _typeId = typeId;

    if(typeId === 0)
      _typeId = null;

    this.getJobs(_typeId, _categoryId);
  }

  onJobClick(id: number) {
    this.router.navigate([`/jobs/${id}`])
  }

  onJobLike(jobId: number) {
    const like: Like = {
      id: null,
      jobId: jobId,
      userId: this.loggedUser.id
    }

    this.likesService.getLike$(like.userId, like.jobId).subscribe({
      next: (response) => {
        if(!response){
          this.likesService.postLike$(like).subscribe({
            next: (response) => {
              let oldJob = this.jobs.find(j => j.id === jobId)
              oldJob.likes.push(response);
              oldJob.likedByMe = true;
            }
          });
        }else{
          this.likesService.deleteLike$(response.id).subscribe({
            next: (_) => {
              let previousJob = this.jobs.find(j => j.id === jobId)
              previousJob.likes = previousJob.likes.filter(l => l.id !== response.id)
              previousJob.likedByMe = false
            }
          });
        }
      }
    });
  }

  onJobGiveUp(jobId: number) {
    const application = this.jobs.find(j => j.id = jobId)?.applications.find(a => a.userId == this.loggedUser.id)
    this.applicationsService.deleteApplication$(application.id).subscribe({
      next: (_) => {
        this.jobs = this.jobs.filter(j => j.id !== jobId)
      }
    });

  }
}
