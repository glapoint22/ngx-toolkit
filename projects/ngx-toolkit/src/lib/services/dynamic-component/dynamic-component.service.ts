import { Overlay, OverlayRef } from '@angular/cdk/overlay';
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

  public open<T>(component: Type<T>, config?: DynamicComponentConfig): DynamicComponentRef<T> {
    const overlayRef = this.createOverlay(config);
    const dynamicComponentRef = new DynamicComponentRef<T>(overlayRef, config);
    const dynamicComponentInjector = Injector.create({
      providers: [
        { provide: DYNAMIC_COMPONENT_DATA, useValue: config?.data },
        { provide: DynamicComponentRef, useValue: dynamicComponentRef }
      ],
      parent: this.injector
    });

    const componentPortal = new ComponentPortal(component, null, dynamicComponentInjector);
    const componentRef = overlayRef.attach(componentPortal);

    dynamicComponentRef.componentInstance = componentRef.instance;
    dynamicComponentRef.componentRef = componentRef;

    return dynamicComponentRef;
  }




  private createOverlay(config?: DynamicComponentConfig): OverlayRef {
    return this.overlay.create({
      positionStrategy: this.getPositionStrategy(config),
      hasBackdrop: config?.hasBackdrop,
      backdropClass: config?.backdropClass,
      width: config?.width,
      height: config?.height,
      maxWidth: config?.maxWidth,
      maxHeight: config?.maxHeight,
      minWidth: config?.minWidth,
      minHeight: config?.minHeight
    });
  }




  private getPositionStrategy(config?: DynamicComponentConfig): any {
    let positionStrategy: any;

    // If no config is provided, or if global positioning is requested, or if flexible positioning is not used
    if (!config || config.globalPosition || !config.useFlexiblePositioning) {
      // Use the global positioning strategy
      positionStrategy = this.overlay.position().global();

      if (config?.globalPosition) {
        // Apply specific global positioning settings based on provided configuration

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

      } else {
        // Default to centering the overlay both vertically and horizontally
        positionStrategy = positionStrategy.centerHorizontally().centerVertically();
      }

    } else {
      // Flexible positioning strategy is required and an origin must be provided
      if (!config.origin) throw new Error('Origin is required for flexible positioning strategy');

      // Use the flexible connected positioning strategy based on the origin element
      positionStrategy = this.overlay.position().flexibleConnectedTo(config.origin);

      // Apply custom connected positions if provided in the configuration
      if (config.conntectedPositions) {
        positionStrategy = positionStrategy.withPositions(config.conntectedPositions);
      }
    }

    // Return the constructed positioning strategy
    return positionStrategy;
  }
}