import { Directive, OnInit } from '@angular/core';
import { Button } from '../button/button';
import { ColorUtil } from '../../utils/color.util';

@Directive({
  selector: '[flatButton]',
  standalone: true
})
export class FlatButtonDirective extends Button implements OnInit {

  public override ngOnInit(): void {
    super.ngOnInit();
    
    const componentName = 'flat-button';
    const colorClass = ColorUtil.getColorClass(this.color(), componentName);

    if (colorClass) this.addClass(colorClass);
    this.addClass(componentName);
  }
}