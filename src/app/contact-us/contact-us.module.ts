import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactPageComponent } from './components/contact-page/contact-page.component';
import {ContactUsRoutingModule} from "./contact-us-routing.module";
import {ReactiveFormsModule} from "@angular/forms";
import {FormatPhoneDirective} from "./directives/format-phone.directive";
import { FieldValidationComponent } from './components/field-validation/field-validation.component';
import {AnimatedLabelDirective} from "./directives/animated-label.directive";



@NgModule({
  declarations: [
    ContactPageComponent,
    FormatPhoneDirective,
    FieldValidationComponent,
    AnimatedLabelDirective
  ],
  imports: [
    CommonModule,
    ContactUsRoutingModule,
    ReactiveFormsModule
  ]
})
export class ContactUsModule { }
