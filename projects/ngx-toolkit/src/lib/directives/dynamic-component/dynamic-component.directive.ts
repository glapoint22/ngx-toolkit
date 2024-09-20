import { ComponentRef, Directive, inject, input, Type, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dynamicComponent]',
  standalone: true
})
export class DynamicComponentDirective<T> {
  public dynamicComponent = input.required<Type<T>>();
  private viewContainerRef = inject(ViewContainerRef);

  ngOnInit() {
    this.viewContainerRef.clear();

    const componentRef: ComponentRef<T> = this.viewContainerRef.createComponent(this.dynamicComponent());
    const component: T = componentRef.instance;

  }
}
