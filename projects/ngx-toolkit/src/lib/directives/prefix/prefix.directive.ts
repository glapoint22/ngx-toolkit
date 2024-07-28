import { Directive } from '@angular/core';
import { Affix } from '../afix/affix';

@Directive({
  selector: '[prefix]',
  standalone: true
})
export class PrefixDirective extends Affix { }