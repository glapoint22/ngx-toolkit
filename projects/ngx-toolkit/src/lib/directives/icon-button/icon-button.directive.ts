import { Directive, input, OnInit } from '@angular/core';
import { Button } from '../button/button';
import { ColorUtil } from '../../utils/color.util';
import { ColorType } from '../../types/color.type';

@Directive({
  selector: '[iconButton]',
  standalone: true
})
export class IconButtonDirective extends Button implements OnInit {
  public override color = input<ColorType>();

  public override ngOnInit(): void {
    const componentName = 'icon-button';
    const colorClass = ColorUtil.getColorClass(this.color(), componentName);

    if (colorClass) this.addClass(colorClass);
    this.addClass('button');
    this.addClass(componentName);
  }
}