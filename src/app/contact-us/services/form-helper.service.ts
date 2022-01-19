import { Injectable } from "@angular/core"
import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";
import isEmpty from "lodash-es/isEmpty";
import { Observable, Subject } from "rxjs";

type ArgumentsType<F> = F extends (...args: infer A) => any ? A : never;

type ObjectLike<O extends object, P extends keyof O = keyof O> = Pick<O, P>;

@Injectable({
  providedIn: "root"
})
export class FormHelperService {
  public extractTouchedChanges(
    control: ObjectLike<AbstractControl, "markAsTouched" | "markAsUntouched">
  ): Observable<boolean> {
    const prevMarkAsTouched = control.markAsTouched;
    const prevMarkAsUntouched = control.markAsUntouched;

    const touchedChanges$ = new Subject<boolean>();

    function nextMarkAsTouched(...args: ArgumentsType<AbstractControl["markAsTouched"]>): void {
      prevMarkAsTouched.bind(control)(...args);
      touchedChanges$.next(true);
    }

    function nextMarkAsUntouched(...args: ArgumentsType<AbstractControl['markAsUntouched']>): void {
      prevMarkAsUntouched.bind(control)(...args);
      touchedChanges$.next(false);
    }

    control.markAsTouched = nextMarkAsTouched;
    control.markAsUntouched = nextMarkAsUntouched;
    return touchedChanges$.asObservable();
  }

  public validate(form: FormGroup): ValidationErrors | null {
    const controlNames = Object.keys(form.controls);
    const allErrorsByControlName = controlNames
      .filter((controlName) => !!form.controls[controlName].errors)
      .reduce<ValidationErrors>(
        (errorsByControlName, controlName) => ({
          ...errorsByControlName,
          [controlName]: form.controls[controlName].errors,
        }),
        {},
      );

    if (isEmpty(allErrorsByControlName)) {
      return null;
    }

    return allErrorsByControlName;
  }
}
