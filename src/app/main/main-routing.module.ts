import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from "./main.component";
import {HomeComponent} from "./home/home.component";
import {JobPostComponent} from "./job-post/job-post.component";
import {JobsComponent} from "./jobs/jobs.component";
import {JobComponent} from "./job/job.component";
import {JobsApplicationsComponent} from "./jobs-applications/jobs-applications.component";
import {JobsPostedComponent} from "./jobs-posted/jobs-posted.component";
import {OrganizationControlGuard} from "../guards/organization-control.guard";
import {UserControlGuard} from "../guards/user-control.guard";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      },
      {
        path: 'jobs',
        component: JobsComponent
      },
      {
        path: 'jobs/post',
        component: JobPostComponent,
        canActivate: [OrganizationControlGuard]
      },
      {
        path: 'jobs/:id',
        component: JobComponent
      },
      {
        path: 'applications',
        component: JobsApplicationsComponent,
        canActivate: [UserControlGuard]
      }
      ,
      {
        path: 'posted',
        component: JobsPostedComponent,
        canActivate: [OrganizationControlGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {
}
