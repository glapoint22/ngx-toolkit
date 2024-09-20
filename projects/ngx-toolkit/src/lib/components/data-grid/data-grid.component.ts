import { Component, ElementRef, inject, input, model, Renderer2, signal, viewChild, ViewContainerRef } from '@angular/core';
import { ColDef } from './models/col-def';
import { CommonModule } from '@angular/common';
import { ColorType } from '../../types/color.type';
import { ColorDirective } from '../../directives/color/color.directive';
import { OverlayModule } from '@angular/cdk/overlay';
import { DynamicComponentDirective } from '../../directives/dynamic-component/dynamic-component.directive';

@Component({
  selector: 'data-grid',
  standalone: true,
  imports: [CommonModule, ColorDirective, OverlayModule, DynamicComponentDirective],
  templateUrl: './data-grid.component.html',
  styleUrl: './data-grid.component.scss'
})
export class DataGridComponent {
  public color = input<ColorType>('primary');
  public columnDefs = model.required<ColDef[]>();
  public rowData = model<any>();
  protected currentSortIndex!: number;
  protected isAsc!: boolean;
  protected selectdRow: any;
  protected borderResizerActive = signal(false);
  private renderer = inject(Renderer2);
  private header = viewChild<ElementRef<HTMLElement>>('header');


  onRowScroll(event: Event) {
    const scrollLeft = (event.target as HTMLElement).scrollLeft;
    
    this.header()?.nativeElement.setAttribute('style', `left: -${scrollLeft}px`);
  }

  protected onMouseDown(columnIndex: number) {
    this.borderResizerActive.set(true);

    const removeMouseMoveListener = this.renderer.listen('window', 'mousemove', (mousemoveEvent: MouseEvent) => {
      this.columnDefs.update((columns: ColDef[]) => {
        columns[columnIndex].width += mousemoveEvent.movementX;

        // Return a new array instance to trigger change detection
        return [...columns];
      });
    });

    const removeMouseUpListener = this.renderer.listen('window', 'mouseup', () => {
      removeMouseMoveListener();
      removeMouseUpListener();
      this.borderResizerActive.set(false);
    });
  }



  protected sortColumn(columnIndex: number): void {
    const column = this.columnDefs()[columnIndex];

    if (this.currentSortIndex === columnIndex) {
      this.isAsc = !this.isAsc;
    } else {
      this.isAsc = true;
    }

    this.currentSortIndex = columnIndex;

    this.rowData.update(rows => {
      return rows.sort((a: any, b: any) => {
        const valueA = a[column.field];
        const valueB = b[column.field];

        if (valueA < valueB) {
          return this.isAsc ? -1 : 1;
        } else if (valueA > valueB) {
          return this.isAsc ? 1 : -1;
        } else {
          return 0;
        }
      });
    });
  }


  protected onRowClick(row: any): void {
    this.selectdRow = row;
  }
}