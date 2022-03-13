import {Component, OnInit} from '@angular/core';
import {JobsService} from "../services/jobs.service";
import {Router} from "@angular/router";
import {Job} from "../models/job.model";
import {take} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {map} from "rxjs/operators";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {
  currentRate: number

  jobs: Job[]
  formGroup: FormGroup = this.fb.group({
    typeId: 0,
    categoryId: 0
  });

  constructor(
    private fb: FormBuilder,
    private jobsService: JobsService,
    private router: Router) { }

  ngOnInit(): void {
    this.getJobs()
  }

  getJobs(typeId: number = null, categoryId: number = null){
    this.jobsService.getJobs$(typeId, categoryId).pipe(
      map((response:  Job[]) => {
        return response.sort((a, b) => {
          if (a.title < b.title) {
            return -1;
          }

          if (a.title > b.title) {
            return 1;
          }

          return 0;
        });
      }),
      take(1)
    ).subscribe({
      next: (response: Job[]) => {
        this.jobs = response;
      },
      error: (response: HttpErrorResponse) => {
        // this.errorMessage = response.message;
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

  onJobDelete(jobId: number): void {
    this.jobsService.deleteBook$(jobId).subscribe({
      next: () => {
        this.jobs = this.jobs.filter(book => book.id !== jobId);
      }
    });
  }
}
