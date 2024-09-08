import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'panel-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel-actions.component.html',
  styleUrl: './panel-actions.component.scss'
})
export class PanelActionsComponent {
  public alignment = input<'start' | 'center' | 'end'>('end');

  protected getAlignment(): string {
    return this.alignment() === 'start' ? 'flex-start' : this.alignment() === 'center' ? 'center' : 'flex-end';
  }
}
