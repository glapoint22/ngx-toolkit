import { Directive, ElementRef, inject, input, OnChanges, Renderer2 } from '@angular/core';
import { ColorType } from '../../types/color.type';
import { ColorUtil } from '../../utils/color.util';

@Directive({
  selector: '[color]',
  standalone: true
})
export class ColorDirective implements OnChanges {
  public color = input<ColorType>();
  public componentName = input.required<string>();
  private el: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);
  private renderer: Renderer2 = inject(Renderer2);


  public ngOnChanges(): void {
    const colorClass = ColorUtil.getColorClass(this.color(), this.componentName());

    if (colorClass) {
      this.renderer.addClass(this.el.nativeElement, colorClass);
    }
  }
}