import { Component, contentChildren, ElementRef, inject, input, OnInit, Renderer2 } from '@angular/core';
import { ColorType } from '../../types/color.type';
import { MenuTriggerDirective } from '../../directives/menu-trigger/menu-trigger.directive';
import { ColorUtil } from '../../utils/color.util';

@Component({
  selector: 'menu-bar',
  standalone: true,
  imports: [],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.scss'
})
export class MenuBarComponent implements OnInit {
  public color = input<ColorType>('primary');
  private menuTriggers = contentChildren(MenuTriggerDirective);
  private isActive: boolean = false;
  private currentActiveMenuTrigger: MenuTriggerDirective | undefined;
  private el: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);
  private renderer: Renderer2 = inject(Renderer2);




  public ngOnInit(): void {
    this.menuTriggers().forEach((menuTrigger: MenuTriggerDirective, index: number) => {
      menuTrigger.onMouseDown.subscribe(() => this.toggleMenu(menuTrigger));
      menuTrigger.onMenuClose.subscribe(() => {
        this.setActive(false);
        this.setCurrentActiveMenuTrigger();
      });
      menuTrigger.onMouseEnter.subscribe(() => this.closeOpenMenu(menuTrigger));
      menuTrigger.onMenuRightArrowDown.subscribe(() => this.selectNextMenuTrigger(index, 1));
      menuTrigger.onMenuLeftArrowDown.subscribe(() => this.selectNextMenuTrigger(index, -1));
    });

    const colorClass = ColorUtil.getColorClass(this.color(), 'menu-bar');

    if (colorClass)
      this.renderer.addClass(this.el.nativeElement, colorClass);
  }




  private selectNextMenuTrigger(index: number, direction: number): void {
    const triggerCount = this.menuTriggers().length;
    const nextMenuTrigger = this.menuTriggers()[(index + direction + triggerCount) % triggerCount];

    this.closeOpenMenu(nextMenuTrigger);
    nextMenuTrigger.menu().selectFirstMenuItem();
  }




  private toggleMenu(menuTrigger: MenuTriggerDirective): void {
    if (this.isActive) {
      this.closeMenu(menuTrigger);
    } else {
      this.openMenu(menuTrigger);
    }
  }




  private openMenu(menuTrigger: MenuTriggerDirective): void {
    this.setCurrentActiveMenuTrigger(menuTrigger);
    menuTrigger.openMenu();
    this.setActive(true);
  }




  private closeMenu(menuTrigger: MenuTriggerDirective): void {
    this.setCurrentActiveMenuTrigger();
    menuTrigger.closeMenu();
    this.setActive(false);
  }




  private closeOpenMenu(menuTrigger: MenuTriggerDirective): void {
    if (this.isActive && this.currentActiveMenuTrigger && this.currentActiveMenuTrigger !== menuTrigger) {
      this.closeMenu(this.currentActiveMenuTrigger);
      this.openMenu(menuTrigger);
    }
  }




  private setActive(active: boolean): void {
    this.isActive = active;

    if (active) {
      this.renderer.setAttribute(this.el.nativeElement, 'id', 'activated-menu-bar');
    }
    else {
      this.renderer.removeAttribute(this.el.nativeElement, 'id');
    }
  }




  private setCurrentActiveMenuTrigger(menuTrigger?: MenuTriggerDirective) {
    if (menuTrigger) {
      this.currentActiveMenuTrigger = menuTrigger;
      menuTrigger.setActive(true);
    } else {
      this.currentActiveMenuTrigger?.setActive(false);
      this.currentActiveMenuTrigger = undefined;
    }
  }
}