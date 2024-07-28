import { Directive } from '@angular/core';
import { Affix } from '../afix/affix';

@Directive({
  selector: '[suffix]',
  standalone: true
})
export class SuffixDirective extends Affix { }