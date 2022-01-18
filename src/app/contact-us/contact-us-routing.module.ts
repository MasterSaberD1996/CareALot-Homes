import {RouterModule, Routes} from "@angular/router";
import {ContactPageComponent} from "./components/contact-page/contact-page.component";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {
    path: '',
    component: ContactPageComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ContactUsRoutingModule {}
