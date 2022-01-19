import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl, ValidationErrors} from "@angular/forms";
import {distinctUntilChanged, filter, map, Subscription} from "rxjs";
import some from "lodash-es/some";
import merge from "lodash-es/merge";
import {ErrorMessageConfigService as ErrorMessageConfig } from "../error-message-config/error-message-config.service";
import {FormHelperService} from "../../services/form-helper.service";

@Component({
  selector: 'app-field-validation',
  templateUrl: './field-validation.component.html',
  styleUrls: ['./field-validation.component.scss']
})
export class FieldValidationComponent implements OnInit {
  // @ts-ignore
  @Input() public fieldName: string;
  // @ts-ignore
  @Input() public control: FormControl;
  @Input() public showErrorOverride = true;
  @Input() public isCustomSelect?: boolean = false;
  @Input() public isDisabled?: boolean = false;
  @ViewChild("contentWrapper")
  // @ts-ignore
  public contentWrapper: ElementRef;
  // @ts-ignore
  public formControlSubscription: Subscription;
  // @ts-ignore
  public errorMessage: string;
  // @ts-ignore
  public showValidationIcon: boolean;
  // @ts-ignore
  private errorList: string[];

  constructor(
    private errorMessageConfigService: ErrorMessageConfig,
    private changeDetectorRef: ChangeDetectorRef,
    private readonly formHelperService: FormHelperService,
  ) {}

  public ngOnInit(): void {
    // @ts-ignore
    this.errorList = this.errorMessageConfigService[this.fieldName];
    const touched$ = this.formHelperService.extractTouchedChanges(this.control);

    this.formControlSubscription = merge(
      touched$,
      this.control.valueChanges,
      this.control.statusChanges,
    )
      .pipe(
        filter(() => this.control.touched),
        map(() => this.getErrorMessage()),
        distinctUntilChanged(),
      )
      .subscribe((errorMessage: string) => {
        // This is necessary to make the field validation component work when used inside
        // of a component that has it's change detection strategy set to onPush.
        this.changeDetectorRef.detectChanges();

        if (
          !errorMessage ||
          errorMessage === ErrorMessageConfig.DO_NOT_SHOW_ANY_ERROR_MESSAGE
        ) {
          this.errorMessage = "";
          return;
        }
        this.errorMessage = errorMessage;
      });
  }

  public ngOnDestroy(): void {
    this.formControlSubscription.unsubscribe();
  }

  public ngAfterViewInit(): void {
    this.showValidationIcon = some(this.contentWrapper.nativeElement.childNodes, (element) =>
      this.shouldShowValidationIcon(element),
    );
    this.changeDetectorRef.detectChanges();
  }

  public showError(): boolean {
    // @ts-ignore
    return this.control.errors && this.control.touched;
  }

  public isValid(): boolean {
    return this.control.valid && this.control.touched;
  }

  public isInvalid(): boolean {
    // @ts-ignore
    return this.control.errors && this.control.touched;
  }

  public isControlDisabled(): boolean {
    // @ts-ignore
    return this.control.disabled || this.isDisabled;
  }

  private getErrorMessage(): string {
    if (!this.control.errors) {
      return "";
    }

    const errorShowOrder = this.getErrorShowOrder(this.control.errors);
    for (const errorKey of errorShowOrder) {
      // @ts-ignore
      if (this.control.errors[errorKey] && this.errorList[errorKey]) {
        // @ts-ignore
        return this.errorList[errorKey];
      }
    }
    return "";
  }

  private shouldShowValidationIcon(element: HTMLInputElement): boolean {
    return (
      element.type === "text" ||
      element.type === "email" ||
      element.type === "tel" ||
      element.type === "password" ||
      element.type === "textarea"
    );
  }

  private getErrorShowOrder(errors: ValidationErrors): string[] {
    const overrides = errors
      ? Object.keys(errors).filter((errorKey) =>
        ["required", "pattern", "mask", "maxlength", "minlength"].every(
          (value) => value !== errorKey,
        ),
      )
      : [];
    return ["required", ...overrides, "pattern", "mask", "maxlength", "minlength"];
  }
}
