import { Directive, OnInit } from '@angular/core';
import { Button } from '../button/button';
import { ColorUtil } from '../../utils/color.util';

@Directive({
  selector: '[strokedButton]',
  standalone: true
})
export class StrokedButtonDirective extends Button implements OnInit {

  public override ngOnInit(): void {
    super.ngOnInit();
    
    const colorClass = ColorUtil.getColorClass(this.color(), 'stroked-button');

    if (colorClass) this.addClass(colorClass);
    this.addClass('stroked-button');
  }
}