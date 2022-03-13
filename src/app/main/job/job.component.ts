import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {JobsService} from "../services/jobs.service";
import {of, Subject, switchMap, takeUntil} from "rxjs";
import {Job} from "../models/job.model";

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {
  job: Job;

  destroy$ = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobsService: JobsService
  ) { }

  ngOnInit(): void {
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
          this.job = response;
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

}
