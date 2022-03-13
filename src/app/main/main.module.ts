import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import {HomeComponent} from "./home/home.component";
import {MainRoutingModule} from "./main-routing.module";
import {MainComponent} from "./main.component";
import {JobPostComponent} from "./job-post/job-post.component";
import {JobsComponent} from "./jobs/jobs.component";
import {NgbRatingModule} from "@ng-bootstrap/ng-bootstrap";
import {JobComponent} from "./job/job.component";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MainRoutingModule,
    NgbRatingModule
  ],
  declarations: [
    MainComponent,
    HomeComponent,
    JobsComponent,
    JobPostComponent,
    JobComponent
  ]
})
export class MainModule {
}
