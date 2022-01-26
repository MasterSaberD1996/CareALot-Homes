import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp } from "firebase/app"
import {environment} from "../environments/environment";
import {CoreModule} from "./core/core.module";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";
import {HttpClientModule} from "@angular/common/http";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { getDatabase } from 'firebase/database';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

export const app = initializeApp(environment.firebaseConfig);
export const functions = getFunctions(app);
export const storage = getStorage(app);
export const database = getDatabase(app);
export const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(environment.recaptchaKey),
  isTokenAutoRefreshEnabled: true
});
