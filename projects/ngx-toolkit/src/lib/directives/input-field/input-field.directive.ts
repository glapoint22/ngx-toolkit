import { Directive, ElementRef, HostListener, Renderer2, inject, output } from '@angular/core';

@Directive({
  selector: '[inputField]',
  standalone: true
})
export class InputFieldDirective {
  public onBlur = output<void>();
  public onFocus = output<void>();
  public el: ElementRef<HTMLInputElement> = inject(ElementRef<HTMLInputElement>);
  private renderer: Renderer2 = inject(Renderer2);
  
  public get isDisabled() : boolean {
    return this.el.nativeElement.disabled;
  }
  

  public ngOnInit(): void {
    this.renderer.addClass(this.el.nativeElement, 'input-field');
  }

  public setFocus(): void {
    this.el.nativeElement.focus();
  }

  @HostListener('focus')
  public focus(): void {
    this.setFocus();
    this.onFocus.emit();
  }
  

  @HostListener('blur')
  public blur(): void {
    this.onBlur.emit();
  }
}