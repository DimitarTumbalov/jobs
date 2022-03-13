import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import {HomeComponent} from "./home/home.component";
import {MainRoutingModule} from "./main-routing.module";
import {MainComponent} from "./main.component";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MainRoutingModule
  ],
  declarations: [
    MainComponent,
    HomeComponent
  ]
})
export class MainModule {
}
