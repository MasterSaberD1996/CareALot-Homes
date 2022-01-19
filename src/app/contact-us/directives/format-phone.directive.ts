import {Directive, Input, OnDestroy, OnInit} from "@angular/core";
import {FormControl} from "@angular/forms";
import {combineLatest, fromEvent, map, Observable, Subscription} from "rxjs";

@Directive({
  selector: '[appPhoneFormat]'
})
export class FormatPhoneDirective implements OnInit, OnDestroy {
  // @ts-ignore
  @Input() public formControl: FormControl;
  // @ts-ignore
  private subscription: Subscription;

  public ngOnInit(): void {
    this.subscription = combineLatest([this.formControl.valueChanges, this.keydown$])
      .pipe(
        map(([value, keydownEvent]: [string, KeyboardEvent]) => {
          if (keydownEvent.key === 'Backspace') {
            return;
          }
          if (value.length === 1 && value !== '(') {
            this.formControl.setValue(`(${value}`)
          }
          if (value.length === 4 && !value.includes(') ')) {
            this.formControl.setValue(`${value}) `)
          }
          if (value.length === 9 && !value.includes('-')) {
            this.formControl.setValue(`${value}-`)
          }
          if (value.length === 10 && (!value.includes('(') || !value.includes(') ') || !value.includes('-'))) {
            const areaCode = value.substring(0, 3);
            const midThree = value.substring(3, 6);
            const lastFour = value.substring(6);
            const formatted = `(${areaCode}) ${midThree}-${lastFour}`;
            this.formControl.setValue(formatted);
          }
        })
      ).subscribe();
  }

  public ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  private keydown$: Observable<KeyboardEvent> = fromEvent(document, 'keydown').pipe(
    map((event) => event as KeyboardEvent)
  )

  public static stripExtraCharactersFromPhone(controlValue: string): string {
    if (!controlValue) {
      // @ts-ignore
      return null;
    }
    let phoneParts = controlValue.split("(");
    phoneParts = phoneParts.filter((x) => x !== "");
    phoneParts = phoneParts[0]?.split(")");
    const newPhoneParts: string[] = [];
    phoneParts?.forEach((part) => {
      part = part.trim();
      const parts = part.split("-");
      parts.forEach((newPart) => {
        newPhoneParts.push(newPart);
      });
    });
    return newPhoneParts.reduce((prev: string, current: string, index: number) => {
      return (prev += current);
    }, "");
  }

}
