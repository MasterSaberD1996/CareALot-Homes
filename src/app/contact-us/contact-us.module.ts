import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactPageComponent } from './components/contact-page/contact-page.component';
import {ContactUsRoutingModule} from "./contact-us-routing.module";



@NgModule({
  declarations: [
    ContactPageComponent
  ],
  imports: [
    CommonModule,
    ContactUsRoutingModule
  ]
})
export class ContactUsModule { }
