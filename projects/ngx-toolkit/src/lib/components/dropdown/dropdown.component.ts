import { AfterViewInit, booleanAttribute, Component, contentChildren, forwardRef, inject, input, Renderer2, TemplateRef, viewChild, ViewContainerRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormFieldComponent } from '../form-field/form-field.component';
import { DropdownItemComponent } from '../dropdown-item/dropdown-item.component';
import { CommonModule } from '@angular/common';
import { ColorDirective } from '../../directives/color/color.directive';
import { PopupService } from '../../services/popup/popup.service';
import { PopupRef } from '../../models/popup-ref';

@Component({
  selector: 'dropdown',
  standalone: true,
  imports: [CommonModule, ColorDirective],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DropdownComponent),
    multi: true
  }]
})
export class DropdownComponent implements AfterViewInit, ControlValueAccessor {
  public disabled = input(false, { transform: booleanAttribute });
  protected selectedValue!: string;
  protected formField = inject(FormFieldComponent);
  private popupService = inject(PopupService);
  private dropdownListTemplate = viewChild<TemplateRef<any>>('dropdownListTemplate');
  private dropdownItems = contentChildren(DropdownItemComponent);
  private viewContainerRef = inject(ViewContainerRef);
  private isDropdownListOpen!: boolean;
  private renderer = inject(Renderer2);
  private removeKeydownListener!: () => void;
  private onChange!: (value: any) => void;
  private selectedDropdownItemIndex: number = -1;
  private popupRef!: PopupRef<any>;


  ngAfterViewInit() {
    this.dropdownItems().forEach(item => {
      item.onDropdownItemClick.subscribe((dropdownItem: DropdownItemComponent) => {
        this.setSelectedItem(dropdownItem);
        this.popupRef.close();
      });
    });
  }




  public toggleList(): void {
    if (this.isDropdownListOpen) {
      this.popupRef.close();
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
    this.popupRef = this.popupService.open(this.dropdownListTemplate()!, this.viewContainerRef, 
      {
        origin: this.viewContainerRef.element.nativeElement.parentElement,
        width: this.viewContainerRef.element.nativeElement.parentElement.clientWidth + 'px',
        repositionOnScroll: true
      }
    );

    this.isDropdownListOpen = true;

    const onCloseSubscription = this.popupRef.onClose().subscribe(() => {
      this.isDropdownListOpen = false;
      onCloseSubscription.unsubscribe();
    });
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
    if (this.isDropdownListOpen) this.popupRef.close();

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
}