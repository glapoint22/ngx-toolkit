import { AfterContentInit, Component, contentChildren, ElementRef, inject, input, output, Renderer2, TemplateRef, viewChild, ViewContainerRef } from '@angular/core';
import { ColorType } from '../../types/color.type';
import { MenuItemDirective } from './menu-item/menu-item.directive';
import { DividerComponent } from '../divider/divider.component';
import { ColorDirective } from '../../directives/color/color.directive';
import { ConnectedPosition, FlexibleConnectedPositionStrategyOrigin } from '@angular/cdk/overlay';
import { PopupService } from '../../services/popup/popup.service';
import { PopupRef } from '../../models/popup-ref';

@Component({
  selector: 'menu',
  standalone: true,
  imports: [ColorDirective],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements AfterContentInit {
  public color = input<ColorType>('primary');
  public onClose = output<void>();
  public onRightArrowDown = output<void>();
  public onLeftArrowDown = output<void>();
  public isOpen: boolean = false;
  private viewContainerRef = inject(ViewContainerRef);
  private popupService = inject(PopupService);
  private menuTemplate = viewChild<TemplateRef<any>>('menuTemplate');
  private menuElement = viewChild<ElementRef<HTMLElement>>('menu');
  private menuItems = contentChildren(MenuItemDirective);
  private dividers = contentChildren(DividerComponent, { read: ElementRef<HTMLElement> });
  private selectedMenuItem!: MenuItemDirective | undefined;
  private isDirty!: boolean;
  private renderer: Renderer2 = inject(Renderer2);
  private removeEscKeyListener!: () => void;
  private removeArrowsListener!: () => void;
  private removeMouseDownListener!: () => void;
  private removeMouseEnterDividerListeners: Array<() => void> = [];
  private removeMouseDownDividerListeners: Array<() => void> = [];
  private parent!: MenuComponent | null;
  private timeoutId!: any;
  private popupRef!: PopupRef<any>;


  public ngAfterContentInit(): void {
    this.menuItems().forEach((menuItem: MenuItemDirective) => {
      menuItem.submenu()?.setParent(this);
      menuItem.onClick.subscribe(() => {
        const parentMenu = this.getParentMenu();

        parentMenu.close();
        parentMenu.onClose.emit();
      });
      menuItem.onMouseEnter.subscribe(() => this.onMenuItemMouseEnter(menuItem));
      menuItem.onKeyEnter.subscribe((event: KeyboardEvent) => this.onMenuItemKeyEnter(menuItem, event));
    });
  }




  public open(element: HTMLElement): void {
    const positions: ConnectedPosition[] = [
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top'
      },
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom'
      }
    ];

    this.openMenu(element, positions);
  }




  public openAt(x: number, y: number): void {
    const positions: ConnectedPosition[] = [
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'top'
      }
    ];

    this.openMenu({ x, y }, positions);
  }




  private openSubmenu(menuItem: MenuItemDirective): void {
    const positions: ConnectedPosition[] = [
      {
        originX: 'end',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'top',
        offsetY: -4
      },
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'top',
        offsetY: -4
      }
    ]

    this.openMenu(menuItem.element.nativeElement, positions);
  }




  private openMenu(origin: FlexibleConnectedPositionStrategyOrigin, positions: ConnectedPosition[]): void {
    this.popupRef = this.popupService.open(this.menuTemplate()!, this.viewContainerRef, {
      origin,
      connectedPositions: positions,
      disableClose: true
    });

    this.isOpen = true;
    this.createListeners();
    setTimeout(() => {
      this.renderer.setStyle(this.menuElement()?.nativeElement, 'pointer-events', 'all');
    });
  }




  public close(): void {
    this.popupRef.close();
    this.removeListeners();
    this.isOpen = false;
    this.setDirty(false);
    this.selectedMenuItem?.setSelected(false);
    this.menuItems().forEach((menuItem) => {
      clearInterval(menuItem.submenu()?.timeoutId);
      if (menuItem.submenu()?.isOpen) menuItem.submenu()?.close();
    });
    this.selectedMenuItem = undefined;
  }




  private getParentMenu(): MenuComponent {
    return this.parent ? this.parent.getParentMenu() : this;
  }




  private setParent(parent: MenuComponent): void {
    this.parent = parent;
  }




  private createListeners(): void {
    // Dividers
    this.dividers().forEach((divider) => {
      const mouseEnterDividerListener = this.renderer.listen(divider.nativeElement, 'mouseenter', () => {
        const submenu = this.selectedMenuItem?.submenu();

        this.delaySubmenuAction(submenu, () => submenu?.close());
        this.selectedMenuItem?.setSelected(false);
      });

      this.removeMouseEnterDividerListeners.push(mouseEnterDividerListener);

      const mouseDownDividerListener = this.renderer.listen(divider.nativeElement, 'mousedown', (event: MouseEvent) => event.stopPropagation());
      this.removeMouseDownDividerListeners.push(mouseDownDividerListener);
    });

    // Esc key
    this.removeEscKeyListener = this.renderer.listen(window, 'keydown.esc', () => {
      if (!this.isSubmenuOpen()) {
        this.selectedMenuItem?.setSelected(false);
        this.close();

        if (!this.parent) this.onClose.emit();
      }
    });

    // Arrow keys
    this.removeArrowsListener = this.renderer.listen(window, 'keydown', (event: KeyboardEvent) => {
      if (this.isSubmenuOpen()) return;
      this.handleArrowKeys(event);
    });

    // Mouse down
    if (!this.parent) {
      this.removeMouseDownListener = this.renderer.listen(window, 'mousedown', () => {
        this.close();
        this.onClose.emit();
      });
    }
  }




  private removeListeners(): void {
    if (this.removeEscKeyListener) this.removeEscKeyListener();
    if (this.removeArrowsListener) this.removeArrowsListener();
    if (this.removeMouseDownListener) this.removeMouseDownListener();

    this.removeMouseEnterDividerListeners.forEach((removeListener) => removeListener());
    this.removeMouseEnterDividerListeners = [];

    this.removeMouseDownDividerListeners.forEach((removeListener) => removeListener());
    this.removeMouseDownDividerListeners = [];
  }




  public selectFirstMenuItem(): void {
    const menuFirstItem = this.getNextMenuItem(-1, 1);

    if (menuFirstItem)
      this.setMenuItemSelected(menuFirstItem);
  }




  private isSubmenuOpen(): boolean {
    return this.menuItems().some((menuItem) => menuItem.submenu()?.isOpen);
  }




  private handleArrowKeys(event: KeyboardEvent): void {
    if (!event.key.startsWith('Arrow')) return;

    let index = this.menuItems().findIndex((menuItem) => menuItem === this.selectedMenuItem);

    switch (event.key) {
      // Arrow Down
      case 'ArrowDown':
        const menuItemDown = this.getNextMenuItem(index, 1);
        if (menuItemDown)
          this.setMenuItemSelected(menuItemDown);
        break;

      // Arrow Up
      case 'ArrowUp':
        if (index === -1) index = this.menuItems().length;
        const menuItemUp = this.getNextMenuItem(index, -1);
        if (menuItemUp)
          this.setMenuItemSelected(menuItemUp);
        break;

      // Arrow Right
      case 'ArrowRight':
        if (this.selectedMenuItem?.submenu()) {
          const submenu = this.selectedMenuItem.submenu();

          submenu?.openSubmenu(this.selectedMenuItem);
          submenu?.selectFirstMenuItem();
        } else {
          const parentMenu = this.getParentMenu();
          parentMenu.onRightArrowDown.emit();
        }
        break;

      // Arrow Left
      case 'ArrowLeft':
        if (this.parent && this.parent.selectedMenuItem) {
          this.parent.selectedMenuItem.submenu()?.close();
          this.parent.setMenuItemSelected(this.parent.selectedMenuItem);
        } else {
          this.onLeftArrowDown.emit();
        }
        break;
    }

    event.preventDefault();
  }




  private getNextMenuItem(currentIndex: number, direction: number): MenuItemDirective | null {
    const itemCount = this.menuItems().length;
    let nextIndex = currentIndex;
    let isFound = false;

    for (let i = 0; i < itemCount; i++) {
      nextIndex = (nextIndex + direction + itemCount) % itemCount;
      if (!this.menuItems()[nextIndex].element.nativeElement.disabled) {
        isFound = true;
        break;
      }
    }

    if (!isFound) {
      return null;
    }

    return this.menuItems()[nextIndex];
  }




  private setDirty(value: boolean): void {
    this.isDirty = value;
  }




  private onMenuItemMouseEnter(menuItem: MenuItemDirective): void {
    const submenu = this.selectedMenuItem?.submenu();

    this.delaySubmenuAction(submenu, () => submenu?.close());
    menuItem.submenu()?.setDirty(false);

    this.setMenuItemSelected(menuItem);
    this.setDirty(true);


    this.delaySubmenuAction(menuItem.submenu(), () => {
      if (menuItem.submenu()?.isOpen || menuItem.element.nativeElement.disabled) return;
      menuItem.submenu()?.openSubmenu(menuItem);
    });
  }




  private onMenuItemKeyEnter(menuItem: MenuItemDirective, event: KeyboardEvent): void {
    if (!menuItem.submenu() || menuItem.submenu()?.isOpen) return;

    event.preventDefault();
    menuItem.submenu()?.openSubmenu(menuItem);
    menuItem.submenu()?.selectFirstMenuItem();
  }




  private delaySubmenuAction(submenu: MenuComponent | undefined, callback: () => void): void {
    if (!submenu) return;
    const submenuDelay: number = 600;

    clearTimeout(submenu.timeoutId);

    submenu.timeoutId = setTimeout(() => {
      callback();
    }, submenuDelay);
  }




  private setMenuItemSelected(menuItem: MenuItemDirective): void {
    this.selectedMenuItem?.setSelected(false);
    menuItem.setSelected(true);
    this.selectedMenuItem = menuItem;
  }




  protected onMenuMouseEnter(): void {
    clearTimeout(this.timeoutId);
    this.selectParentMenuItem();
  }




  private selectParentMenuItem(): void {
    if (this.parent) {
      for (let menuItem of this.parent.menuItems()) {
        if (menuItem.submenu()?.isOpen) {
          this.parent.setMenuItemSelected(menuItem);
          break;
        }
      }
    }
  }




  protected onMenuMouseLeave(): void {
    setTimeout(() => {
      if (!this.selectedMenuItem?.submenu()?.isDirty) {
        const submenu = this.selectedMenuItem?.submenu();

        this.delaySubmenuAction(submenu, () => submenu?.close());
        this.selectedMenuItem?.setSelected(false);
      }
    });
  }
}