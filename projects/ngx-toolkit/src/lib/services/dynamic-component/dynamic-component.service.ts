import { FlexibleConnectedPositionStrategy, GlobalPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { inject, Injectable, Injector, TemplateRef, Type, ViewContainerRef } from '@angular/core';
import { DynamicComponentConfig } from '../../models/dynamic-component-config';
import { DYNAMIC_COMPONENT_DATA } from '../../types/dynamic-component-data';
import { DynamicComponentRef } from '../../models/dynamic-component-ref';

@Injectable({
  providedIn: 'root'
})
export class DynamicComponentService {
  private overlay = inject(Overlay);
  private injector = inject(Injector);

  public open<T>(component: Type<T>, config?: DynamicComponentConfig): DynamicComponentRef<T>;




  public open<T>(templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef, config?: DynamicComponentConfig): DynamicComponentRef<T>;




  public open<T>(componentOrTemplate: Type<T> | TemplateRef<any>, viewContainerRefOrConfig?: ViewContainerRef | DynamicComponentConfig, config?: DynamicComponentConfig): DynamicComponentRef<T> {
    config = viewContainerRefOrConfig instanceof ViewContainerRef ? config : viewContainerRefOrConfig as DynamicComponentConfig;

    const viewContainerRef = viewContainerRefOrConfig instanceof ViewContainerRef ? viewContainerRefOrConfig : undefined;
    const overlayRef = this.createOverlay(config);
    const dynamicComponentRef = new DynamicComponentRef<T>(overlayRef, config);
    const dynamicComponentInjector = Injector.create({
      providers: [
        { provide: DYNAMIC_COMPONENT_DATA, useValue: config?.data },
        { provide: DynamicComponentRef, useValue: dynamicComponentRef }
      ],
      parent: this.injector
    });

    const portal = this.createPortal(componentOrTemplate, dynamicComponentInjector, viewContainerRef);
    const componentRef = overlayRef.attach(portal);

    dynamicComponentRef.instance = componentRef.instance;
    dynamicComponentRef.componentRef = componentRef;

    return dynamicComponentRef;
  }




  private createPortal<T>(componentOrTemplate: Type<T> | TemplateRef<any>, injector: Injector, viewContainerRef?: ViewContainerRef): ComponentPortal<T> | TemplatePortal<any> {
    if (componentOrTemplate instanceof TemplateRef) {
      const templateRef = componentOrTemplate as TemplateRef<any>;

      return new TemplatePortal(templateRef, viewContainerRef!, null, injector);
    } else {
      const component = componentOrTemplate as Type<T>;

      return new ComponentPortal(component, null, injector);
    }
  }



  
  private createOverlay(config?: DynamicComponentConfig): OverlayRef {
    // Create an overlay using the provided configuration options.
    return this.overlay.create({
      positionStrategy: this.getPositionStrategy(config), // Set the position strategy
      hasBackdrop: config?.hasBackdrop, // Optionally enable or disable the backdrop
      backdropClass: config?.backdropClass, // Optionally apply a custom backdrop class
      width: config?.width, // Optionally set the overlay's width
      height: config?.height, // Optionally set the overlay's height
      maxWidth: config?.maxWidth, // Optionally set a maximum width for the overlay
      maxHeight: config?.maxHeight, // Optionally set a maximum height for the overlay
      minWidth: config?.minWidth, // Optionally set a minimum width for the overlay
      minHeight: config?.minHeight // Optionally set a minimum height for the overlay
    });
  }




  private getPositionStrategy(config?: DynamicComponentConfig): GlobalPositionStrategy | FlexibleConnectedPositionStrategy {
    let positionStrategy: GlobalPositionStrategy | FlexibleConnectedPositionStrategy;

    // Determine which positioning strategy to use based on the provided configuration.
    // If no configuration is provided, or if global positioning is explicitly specified,
    // or if neither connected position origin nor connected positions are defined,
    // the global positioning strategy will be used. Otherwise, use a flexible connected
    // positioning strategy.
    if (!config || config.globalPosition || (!config.connectedPositionOrigin && !config.conntectedPositions)) {
      // Use the global positioning strategy
      positionStrategy = this.overlay.position().global();

      if (config?.globalPosition) {
        // Apply specific global positioning settings based on provided configuration
        positionStrategy = this.getGlobalPositionStrategy(positionStrategy, config);

      } else {
        // Default to centering the overlay both vertically and horizontally
        positionStrategy = positionStrategy.centerHorizontally().centerVertically();
      }

    } else {
      // Use the flexible connected positioning strategy
      positionStrategy = this.getFlexiblePositionStrategy(config);
    }

    // Return the constructed positioning strategy
    return positionStrategy;
  }




  private getGlobalPositionStrategy(positionStrategy: GlobalPositionStrategy, config: DynamicComponentConfig): GlobalPositionStrategy {
    // Handle vertical positioning
    if (config.globalPosition?.top !== undefined) {
      positionStrategy = positionStrategy.top(config.globalPosition.top);
    } else if (config.globalPosition?.bottom !== undefined) {
      positionStrategy = positionStrategy.bottom(config.globalPosition.bottom);
    } else {
      positionStrategy = positionStrategy.centerVertically();
    }

    // Handle horizontal positioning
    if (config.globalPosition?.left !== undefined) {
      positionStrategy = positionStrategy.left(config.globalPosition.left);
    } else if (config.globalPosition?.right !== undefined) {
      positionStrategy = positionStrategy.right(config.globalPosition.right);
    } else {
      positionStrategy = positionStrategy.centerHorizontally();
    }

    return positionStrategy;
  }




  private getFlexiblePositionStrategy(config: DynamicComponentConfig): FlexibleConnectedPositionStrategy {
    // Ensure connected positions are provided; otherwise, throw an error
    if (!config.conntectedPositions) throw new Error('Connected positions are required for flexible connected positioning strategy');

    // Ensure the connected position origin is provided; otherwise, throw an error
    if (!config.connectedPositionOrigin) throw new Error('Connected position origin is required for flexible connected positioning strategy');

    let positionStrategy: FlexibleConnectedPositionStrategy;

    // Use the flexible connected positioning strategy based on the origin element
    positionStrategy = this.overlay.position().flexibleConnectedTo(config.connectedPositionOrigin);

    // Apply custom connected positions
    positionStrategy = positionStrategy.withPositions(config.conntectedPositions);

    return positionStrategy;
  }
}