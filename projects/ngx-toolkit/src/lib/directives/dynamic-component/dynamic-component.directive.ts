import { ComponentRef, Directive, inject, Injector, input, Type, ViewContainerRef } from '@angular/core';
import { COMPONENT_PARAMS } from '../../components/data-grid/models/col-def';

@Directive({
  selector: '[dynamicComponent]',
  standalone: true
})
export class DynamicComponentDirective<T> {
  public dynamicComponent = input.required<any>();
  private viewContainerRef = inject(ViewContainerRef);
  private injector = inject(Injector);

  ngOnInit() {
    this.viewContainerRef.clear();

    const injector = Injector.create({
      providers: [
        { provide: COMPONENT_PARAMS, useValue: this.dynamicComponent().params }
      ],
      parent: this.injector
    });

    const componentRef: ComponentRef<T> = this.viewContainerRef.createComponent(this.dynamicComponent().component, { injector: injector });
    const component: T = componentRef.instance;

  }
}
