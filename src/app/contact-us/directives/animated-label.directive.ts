import { AfterContentInit, Directive, ElementRef, Input, OnDestroy } from "@angular/core";
import some from "lodash-es/some";
import { Observable, Subscription } from "rxjs";

@Directive({
  selector: "[appAnimatedLabel]",
})
export class AnimatedLabelDirective implements AfterContentInit, OnDestroy {
  // @ts-ignore
  @Input() public id: string;
  // @ts-ignore
  @Input() public appAnimatedLabel: string;
  @Input() public appAnimatedLabelObservable?: Observable<string>;

  private wrapperClassName = "form-control-wrapper";
  private animationClassName = "animated";
  // @ts-ignore
  private observer: MutationObserver;
  // @ts-ignore
  private labelTextSubscription: Subscription;
  private hasFocus = false;
  // @ts-ignore
  private labelElement: HTMLLabelElement;

  constructor(private readonly elementRef: ElementRef) {}

  public ngAfterContentInit(): void {
    const labelText =
      this.appAnimatedLabel || this.elementRef.nativeElement.getAttribute("placeholder");
    if (!labelText || labelText.trim() === "") {
      return;
    }

    this.elementRef.nativeElement.setAttribute("placeholder", "");
    this.elementRef.nativeElement.classList.add("animated-form-control");
    this.wrapElement(this.elementRef);

    const id = this.setInputId(this.elementRef);
    this.labelElement = this.addLabel(this.elementRef, id, labelText);

    this.setupAnimationListeners(this.labelElement);
    this.subscribeToLabelTextChanges();
  }

  public ngOnDestroy(): void {
    this.observer.disconnect();
    if (this.labelTextSubscription) {
      this.labelTextSubscription.unsubscribe();
    }
  }

  private setInputId(elementRef: ElementRef): string {
    if (!this.id || this.id.trim() === "") {
      this.id = Math.floor(Math.random() * 1000000000).toString();
      elementRef.nativeElement.setAttribute("id", this.id);
    }

    return this.id;
  }

  private addLabel(elementRef: ElementRef, inputId: string, labelText: string): HTMLLabelElement {
    const labelElement: HTMLLabelElement = document.createElement("label");
    labelElement.classList.add("animated-label");
    labelElement.setAttribute("for", inputId);
    labelElement.innerHTML = labelText;
    elementRef.nativeElement.parentElement.appendChild(labelElement);
    return labelElement;
  }

  private subscribeToLabelTextChanges(): void {
    if (this.appAnimatedLabelObservable) {
      this.labelTextSubscription = this.appAnimatedLabelObservable.subscribe((text) => {
        this.labelElement.innerHTML = text;
        this.evaluateAnimationClassName(this.labelElement);
      });
    }
  }

  private wrapElement(elementRef: ElementRef): void {
    if (this.parentHasWrapperClass(elementRef.nativeElement)) {
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.classList.add(this.wrapperClassName);
    this.addElementTypeClassToWrapper(wrapper, elementRef);

    elementRef.nativeElement.parentNode.insertBefore(wrapper, elementRef.nativeElement);
    wrapper.appendChild(elementRef.nativeElement);
  }

  private parentHasWrapperClass(element: HTMLElement): boolean {
    // @ts-ignore
    return some(element.parentElement.classList, this.wrapperClassName);
  }

  private addElementTypeClassToWrapper(wrapper: HTMLElement, elementRef: ElementRef): void {
    if (this.getElementType(elementRef) === "select") {
      wrapper.classList.add("is-select");
    }

    if (this.getElementType(elementRef) === "input") {
      wrapper.classList.add("is-input");
    }
  }

  private getElementType(elementRef: ElementRef): string {
    return elementRef.nativeElement.tagName.toLowerCase();
  }

  private setupAnimationListeners(labelElement: HTMLLabelElement): void {
    this.evaluateAnimationClassName(labelElement);
    this.elementRef.nativeElement.addEventListener("focus", () => {
      this.hasFocus = true;
      this.evaluateAnimationClassName(labelElement);
    });
    this.elementRef.nativeElement.addEventListener("blur", () => {
      this.hasFocus = false;
      this.evaluateAnimationClassName(labelElement);
    });
    this.observer = new MutationObserver((): void => {
      this.evaluateAnimationClassName(labelElement);
    });
    this.observer.observe(this.elementRef.nativeElement, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  }

  private evaluateAnimationClassName(labelElement: HTMLLabelElement): void {
    if (!this.elementRef || !labelElement) {
      return;
    }

    if (this.hasFocus || this.elementRef.nativeElement.value) {
      labelElement.classList.add(this.animationClassName);
      return;
    }

    if (!this.elementRef.nativeElement.value && this.elementRef.nativeElement.type !== "date") {
      labelElement.classList.remove(this.animationClassName);
    }
  }
}
