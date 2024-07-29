import { AfterViewInit, booleanAttribute, Component, contentChildren, inject, input, Renderer2, TemplateRef, viewChild, ViewContainerRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { FormFieldComponent } from '../form-field/form-field.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DropdownItemComponent } from '../dropdown-item/dropdown-item.component';
import { CommonModule } from '@angular/common';
import { ColorDirective } from '../../directives/color/color.directive';

@Component({
  selector: 'dropdown',
  standalone: true,
  imports: [CommonModule, ColorDirective],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent implements AfterViewInit, ControlValueAccessor {
  public disabled = input(false, { transform: booleanAttribute });
  protected selectedValue!: string;
  protected formField = inject(FormFieldComponent);
  private dropdownListTemplate = viewChild<TemplateRef<any>>('dropdownListTemplate');
  private dropdownItems = contentChildren(DropdownItemComponent);
  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  private overlayRef!: OverlayRef;
  private isDropdownListOpen!: boolean;
  private renderer = inject(Renderer2);
  private removeEscapeKeyListener!: () => void;
  private removeMousewheelListener!: () => void;
  private removeKeydownListener!: () => void;
  private onChange!: (value: any) => void;
  private selectedDropdownItemIndex: number = -1;


  ngAfterViewInit() {
    this.dropdownItems().forEach(item => {
      item.onDropdownItemClick.subscribe((dropdownItem: DropdownItemComponent) => {
        this.setSelectedItem(dropdownItem);
        this.closeList();
      });
    });
  }




  public toggleList(): void {
    if (this.isDropdownListOpen) {
      this.closeList();
    } else {
      this.openList();
      const dropdownItem: DropdownItemComponent = this.dropdownItems()[this.selectedDropdownItemIndex];
      this.scrollIntoView(dropdownItem);
    }
  }




  private setSelectedItem(item: DropdownItemComponent): void {
    this.dropdownItems().forEach((dropdownItem: DropdownItemComponent, index: number) => {
      dropdownItem.setSelected(dropdownItem === item);
      if (dropdownItem === item) {
        this.selectedDropdownItemIndex = this.getSelectedDropdownItemIndex(index);
      }
    });

    this.selectedValue = item.value();
    this.onChange(this.selectedValue);
  }



  
  private openList(): void {
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.viewContainerRef.element.nativeElement.parentElement)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: -1
        }
      ]);

    this.overlayRef = this.overlay.create({ positionStrategy, width: this.viewContainerRef.element.nativeElement.parentElement.clientWidth + 'px' });

    const portal = new TemplatePortal(this.dropdownListTemplate()!, this.viewContainerRef);
    this.overlayRef.attach(portal);

    this.isDropdownListOpen = true;

    this.removeEscapeKeyListener = this.renderer.listen('window', 'keydown.escape', () => this.closeList());
    this.removeMousewheelListener = this.renderer.listen('window', 'mousewheel', () => this.closeList());
  }




  private onArrowKeyPress(arrow: number): void {
    const index = this.selectedDropdownItemIndex = this.getSelectedDropdownItemIndex(this.selectedDropdownItemIndex + arrow);
    const dropdownItem: DropdownItemComponent = this.dropdownItems()[index];

    this.setSelectedItem(dropdownItem);
    this.scrollIntoView(dropdownItem);
  }




  private scrollIntoView(item: DropdownItemComponent): void {
    item.element()?.nativeElement.scrollIntoView({ block: 'nearest' });
  }




  public onFocus(): void {
    this.createKeydownListener();
  }




  public onBlur(): void {
    this.removeKeydownListener();
    if (this.isDropdownListOpen) this.closeList();

  }




  private createKeydownListener(): void {
    this.removeKeydownListener = this.renderer.listen('window', 'keydown', (event: KeyboardEvent) => {
      const { key, altKey } = event;

      if (['ArrowDown', 'ArrowUp', 'Enter'].includes(key)) {
        event.preventDefault();

        if (altKey || key === 'Enter') {
          this.toggleList();
        } else {
          this.onArrowKeyPress(key === 'ArrowDown' ? 1 : -1);
        }
      }
    });
  }




  private closeList(): void {
    this.overlayRef.detach();
    this.isDropdownListOpen = false;
    this.removeEscapeKeyListener();
    this.removeMousewheelListener();
  }




  private getSelectedDropdownItemIndex(index: number): number {
    return Math.min(Math.max(0, index), this.dropdownItems().length - 1);
  }




  writeValue(value: any): void {
    this.selectedValue = value;
    this.dropdownItems().forEach((dropdownItem: DropdownItemComponent, index: number) => {
      if (dropdownItem.value() === value) {
        dropdownItem.setSelected(true);
        this.selectedDropdownItemIndex = this.getSelectedDropdownItemIndex(index);
      } else {
        dropdownItem.setSelected(false);
      }
    });
  }




  registerOnChange(fn: any): void {
    this.onChange = fn;
  }




  registerOnTouched(fn: any): void { }




  ngOnDestroy(): void {
    this.overlayRef.dispose();
  }
}