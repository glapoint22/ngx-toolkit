import { Directive, OnInit } from '@angular/core';
import { Button } from '../button/button';
import { ColorUtil } from '../../utils/color.util';

@Directive({
  selector: '[raisedButton]',
  standalone: true
})
export class RaisedButtonDirective extends Button implements OnInit {

  public override ngOnInit(): void {
    super.ngOnInit();

    const componentName = 'raised-button';
    const colorClass = ColorUtil.getColorClass(this.color(), componentName);

    if (colorClass) this.addClass(colorClass);
    this.addClass(componentName);
  }
}