import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import { functions } from '../../../app.module';
import {connectFunctionsEmulator, httpsCallable} from "firebase/functions";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent implements OnInit {
  // @ts-ignore
  public contactForm: FormGroup;

  public get nameControl(): FormControl {
    return this.contactForm?.get("name") as FormControl;
  }
  public get emailControl(): FormControl {
    return this.contactForm?.get("email") as FormControl;
  }
  public get messageControl(): FormControl {
    return this.contactForm?.get("message") as FormControl;
  }
  public get phoneControl(): FormControl {
    return this.contactForm?.get("phone") as FormControl;
  }
  public get locationControl(): FormControl {
    return this.contactForm.get("location") as FormControl;
  }

  public isSelectOpen: boolean = false;

  constructor() { }

  public ngOnInit(): void {
    this.contactForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.email, Validators.required]),
      phone: new FormControl(null, [Validators.required, Validators.minLength(14), this.countryCodeValidator]),
      location: new FormControl(null, [Validators.required]),
      message: new FormControl(null, [Validators.required]),
    })
  }

  private countryCodeValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    if (value.length === 2 && (value.includes('(') || value.includes('+'))) {
      return value[1] === '1' || value[1] === '+' ? {invalidStart: true} : null
    }
    if (value.length === 1) {
      return value === '1' || value === '+' ? {invalidStart: true} : null
    }
    return null;
  }

  public submitMessage(): void {
    this.contactForm.markAllAsTouched();
    if (!this.contactForm.valid) {
      return;
    }
    if (!environment.production) {
      connectFunctionsEmulator(functions, 'localhost', 5001)
    }
    const sendEmail = httpsCallable(functions, "sendEmail");
    const {name, email, message, phone, location} = this.contactForm.value;
    const request = {
      toEmail: location === 'florida' ? environment.floridaLocationEmail : environment.utahLocationEmail,
      location: location === 'florida' ? "Erika's House ALF" : 'Beehive Homes of Roy',
      message: `${message}<br/><br>${name}<br>${email}<br>${phone}`
    }
    sendEmail(request)
      .then((response) => {
        if (response.data && response.data === "sent") {
          console.log("sent email send code for updating page")
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  public setClosed(): void {
    this.isSelectOpen = false;
  }

  public toggleFocus(): void {
    this.isSelectOpen = !this.isSelectOpen;
  }
}
