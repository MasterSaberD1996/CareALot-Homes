import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./core/components/home/home.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: 'contact',
    loadChildren: () => import('./contact-us/contact-us.module').then(m => m.ContactUsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
