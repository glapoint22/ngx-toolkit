import { Component, HostBinding, input } from '@angular/core';
import { ColorType } from '../../types/color.type';
import { ColorDirective } from '../../directives/color/color.directive';

@Component({
  selector: 'spinner',
  standalone: true,
  imports: [ColorDirective],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
  public color = input<ColorType>('primary');
  public spinnerRadius = input(32);
  public dotRadius = input(6);

  @HostBinding('style.--spinner-radius') get spinnerDiameter() {
    return `${this.spinnerRadius() * 2}px`;
  }
  
  @HostBinding('style.--dot-radius') get dotDiameter() {
    return `${this.dotRadius() * 2}px`;
  }
}