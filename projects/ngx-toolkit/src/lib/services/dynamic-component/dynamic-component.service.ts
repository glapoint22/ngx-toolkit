import { FlexibleConnectedPositionStrategy, GlobalPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { inject, Injectable, Injector, Type } from '@angular/core';
import { DynamicComponentConfig } from '../../models/dynamic-component-config';
import { DYNAMIC_COMPONENT_DATA } from '../../types/dynamic-component-data';
import { DynamicComponentRef } from '../../models/dynamic-component-ref';

@Injectable({
  providedIn: 'root'
})
export class DynamicComponentService {
  private overlay = inject(Overlay);
  private injector = inject(Injector);

  /**
 * Opens a dynamic component and attaches it to an overlay.
 * 
 * @template T The type of the component to open.
 * @param component The component type to instantiate dynamically.
 * @param config Optional configuration for creating the overlay and injecting data into the component.
 * @returns A reference to the dynamic component, allowing interaction with it.
 */
  public open<T>(component: Type<T>, config?: DynamicComponentConfig): DynamicComponentRef<T> {
    // Create an overlay reference using the provided configuration.
    // The overlay will act as a container for the dynamic component.
    const overlayRef = this.createOverlay(config);

    // Create a new instance of DynamicComponentRef which will manage the dynamic component.
    // This holds the overlay reference and configuration.
    const dynamicComponentRef = new DynamicComponentRef<T>(overlayRef, config);

    // Create an injector specifically for the dynamic component.
    // This injector provides the data and a reference to the dynamic component.
    const dynamicComponentInjector = Injector.create({
      providers: [
        // Provide the configuration data as DYNAMIC_COMPONENT_DATA, which the component can inject.
        { provide: DYNAMIC_COMPONENT_DATA, useValue: config?.data },
        // Provide the dynamicComponentRef itself, so the component can have a reference to it.
        { provide: DynamicComponentRef, useValue: dynamicComponentRef }
      ],
      // Use the parent injector to resolve other dependencies.
      parent: this.injector
    });

    // Create a portal for the component to be dynamically injected into the overlay.
    // A portal is a way to dynamically render a component in a target location.
    const componentPortal = new ComponentPortal(component, null, dynamicComponentInjector);

    // Attach the component to the overlay, which returns a reference to the attached component.
    const componentRef = overlayRef.attach(componentPortal);

    // Assign the component instance to the dynamicComponentRef for further manipulation if needed.
    dynamicComponentRef.instance = componentRef.instance;
    // Store the component reference in the dynamicComponentRef for later access.
    dynamicComponentRef.componentRef = componentRef;

    // Return the dynamicComponentRef which allows interaction with the dynamically created component.
    return dynamicComponentRef;
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