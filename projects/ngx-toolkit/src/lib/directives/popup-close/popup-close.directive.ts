import { Directive, HostListener, inject, input } from '@angular/core';
import { PopupRef } from '../../models/popup-ref';

@Directive({
  selector: '[popupClose]',
  standalone: true
})
export class PopupCloseDirective {
  public popupClose = input();
  private popupRef = inject(PopupRef, { optional: true });

  @HostListener('click')
  onClick(): void {
    if (this.popupRef) {
      this.popupRef.close(this.popupClose());
    }
  }
}