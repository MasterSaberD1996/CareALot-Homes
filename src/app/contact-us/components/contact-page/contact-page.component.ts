import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";

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

  constructor() { }

  public ngOnInit(): void {
    this.contactForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.email, Validators.required]),
      message: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required, Validators.minLength(14), this.countryCodeValidator])
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
}
