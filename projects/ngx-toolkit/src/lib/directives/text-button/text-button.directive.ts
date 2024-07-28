import { Directive, OnInit } from '@angular/core';
import { Button } from '../button/button';

@Directive({
  selector: '[textButton]',
  standalone: true
})
export class TextButtonDirective extends Button implements OnInit {

  public override ngOnInit(): void {
    super.ngOnInit();
    this.addClass('text-button');
  }
}