import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import {RegisterComponent} from "./register/register.component";
import {AuthRoutingModule} from "./auth-routing.module";
import {AuthService} from "./services/auth.service";

@NgModule({
  providers: [
    AuthService
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    AuthRoutingModule
  ],
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent
  ]
})
export class AuthModule {
}
