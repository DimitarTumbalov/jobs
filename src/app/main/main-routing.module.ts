import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from "./main.component";
import {HomeComponent} from "./home/home.component";
import {JobFormComponent} from "./jobs/job-form/job-form.component";
import {JobsComponent} from "./jobs/jobs/jobs.component";
import {JobComponent} from "./jobs/job/job.component";
import {JobsApplicationsComponent} from "./jobs/jobs-applications/jobs-applications.component";
import {JobsPostedComponent} from "./jobs/jobs-posted/jobs-posted.component";
import {OrganizationControlGuard} from "../guards/organization-control.guard";
import {UserControlGuard} from "../guards/user-control.guard";
import {AccountComponent} from "./account/account.component";

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
        component: JobFormComponent,
        canActivate: [OrganizationControlGuard]
      },
      {
        path: 'jobs/edit/:id',
        component: JobFormComponent,
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
      },
      {
        path: 'account',
        component: AccountComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {
}
