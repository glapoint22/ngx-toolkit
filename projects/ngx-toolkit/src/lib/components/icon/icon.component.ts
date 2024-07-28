import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, computed, input, Signal } from '@angular/core';
import { ColorType } from '../../types/color.type';
import { ColorDirective } from '../../directives/color/color.directive';

@Component({
  selector: 'icon',
  standalone: true,
  imports: [CommonModule, ColorDirective],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss'
})
export class IconComponent {
  public color = input<ColorType>();
  public fill = input(false, { transform: booleanAttribute });
  public wght = input<number>(400);
  public grad = input<number>(0);
  public opsz = input<number>(24);
  public fontSize = input<number>(24);
  protected fontVariationSettings!: string;
  

  public ngOnInit(): void {
    // Initialize font variation settings.
    this.setFontVariationSettings();
  }


  
  
  private setFontVariationSettings(): void {
    // Create a computed signal that determines if fill is enabled (1) or not (0).
    const isFill: Signal<number> = computed(() => this.fill() ? 1 : 0);

    // Set the font variation settings string based on input properties.
    this.fontVariationSettings = `
    'FILL' ${isFill()},
    'wght' ${this.wght()},
    'GRAD' ${this.grad()},
    'opsz' ${this.opsz()}`;
  }
}