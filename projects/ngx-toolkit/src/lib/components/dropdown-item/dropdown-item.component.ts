import { CommonModule } from '@angular/common';
import { Component, ElementRef, input, output, viewChild } from '@angular/core';

@Component({
  selector: 'dropdown-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown-item.component.html',
  styleUrl: './dropdown-item.component.scss'
})
export class DropdownItemComponent {
  public value = input<any>();
  public onDropdownItemClick = output<DropdownItemComponent>();
  protected isSelected!: boolean;
  public element = viewChild<ElementRef<HTMLElement>>('element');

  protected onClick(): void {
    this.onDropdownItemClick.emit(this);
  }

  public setSelected(isSelected: boolean): void {
    this.isSelected = isSelected;
  }
}