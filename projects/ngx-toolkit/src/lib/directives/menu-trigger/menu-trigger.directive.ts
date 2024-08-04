import { Directive, ElementRef, HostListener, inject, input, output, Renderer2 } from '@angular/core';
import { MenuComponent } from '../../components/menu/menu.component';

@Directive({
  selector: '[menuTrigger]',
  standalone: true
})
export class MenuTriggerDirective {
  public menu = input.required<MenuComponent>({ alias: 'menuTrigger' });
  public onMouseDown = output<void>();
  public onMenuClose = output<void>();
  public onMouseEnter = output<void>();
  public onMenuRightArrowDown = output<void>();
  public onMenuLeftArrowDown = output<void>();
  private el: ElementRef<HTMLButtonElement> = inject(ElementRef<HTMLButtonElement>);
  private renderer: Renderer2 = inject(Renderer2);
  
  
  public ngOnInit(): void {
    this.renderer.addClass(this.el.nativeElement, 'menu-bar-item');
    this.menu().onClose.subscribe(() => this.onMenuClose.emit());
    this.menu().onRightArrowDown.subscribe(() => this.onMenuRightArrowDown.emit());
    this.menu().onLeftArrowDown.subscribe(() => this.onMenuLeftArrowDown.emit());
  }




  public openMenu(): void {
    this.menu().open(this.el.nativeElement);
  }




  public closeMenu(): void {
    this.menu().close();
  }




  public setActive(active: boolean): void {
    if (active) {
      this.renderer.addClass(this.el.nativeElement, 'activated-menu-bar-item');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'activated-menu-bar-item');
    }
  }




  @HostListener('mousedown', ['$event'])
  public handleMouseDown(event: MouseEvent): void {
    this.onMouseDown.emit();
    event.stopPropagation();
  }



  
  @HostListener('mouseenter')
  public handleMouseEnter(): void {
    this.onMouseEnter.emit();
  }
}