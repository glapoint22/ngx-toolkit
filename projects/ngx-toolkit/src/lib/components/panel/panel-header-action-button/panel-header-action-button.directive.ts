import { Directive, ElementRef, inject, Renderer2 } from '@angular/core';

@Directive({
  selector: '[panelHeaderActionButton]',
  standalone: true
})
export class PanelHeaderActionButtonDirective {
  private el: ElementRef<HTMLButtonElement> = inject(ElementRef<HTMLButtonElement>);
  private renderer: Renderer2 = inject(Renderer2);

  public ngOnInit(): void {
    this.renderer.addClass(this.el.nativeElement, 'panel-header-action-button');
  }
}