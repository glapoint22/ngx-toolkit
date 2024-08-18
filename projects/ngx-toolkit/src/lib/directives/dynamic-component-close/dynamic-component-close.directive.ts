import { Directive, HostListener, inject, input } from '@angular/core';
import { DynamicComponentRef } from '../../models/dynamic-component-ref';

@Directive({
  selector: '[dynamicComponentClose]',
  standalone: true
})
export class DynamicComponentCloseDirective {
  public dynamicComponentClose = input();
  private dynamicComponentRef = inject(DynamicComponentRef, { optional: true });

  @HostListener('click')
  onClick(): void {
    if (this.dynamicComponentRef) {
      this.dynamicComponentRef.close(this.dynamicComponentClose());
    }
  }
}