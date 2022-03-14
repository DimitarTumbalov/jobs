import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {HomeComponent} from "./home/home.component";
import {MainRoutingModule} from "./main-routing.module";
import {MainComponent} from "./main.component";
import {JobFormComponent} from "./jobs/job-form/job-form.component";
import {JobsComponent} from "./jobs/jobs/jobs.component";
import {NgbRatingModule} from "@ng-bootstrap/ng-bootstrap";
import {JobComponent} from "./jobs/job/job.component";
import {JobsApplicationsComponent} from "./jobs/jobs-applications/jobs-applications.component";
import {JobsPostedComponent} from "./jobs/jobs-posted/jobs-posted.component";
import {AccountComponent} from "./account/account.component";

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
    JobFormComponent,
    JobComponent,
    JobsApplicationsComponent,
    JobsPostedComponent,
    AccountComponent
  ]
})
export class MainModule {
}
