import { Component, input } from '@angular/core';
import { ColorType } from '../../types/color.type';
import { ColorDirective } from '../../directives/color/color.directive';

@Component({
  selector: 'panel',
  standalone: true,
  imports: [ColorDirective],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent {
  public color = input<ColorType>('primary');
}