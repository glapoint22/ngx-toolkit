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




  private getPositionStrategy(config?: DynamicComponentConfig): GlobalPositionStrategy | FlexibleConnectedPositionStrategy {
    let positionStrategy: GlobalPositionStrategy | FlexibleConnectedPositionStrategy;

    // If no config is provided or if global positioning is requested
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
    if (!config.conntectedPositions) throw new Error('Connected positions are required for flexible connected positioning strategy');
    if (!config.connectedPositionOrigin) throw new Error('Connected position origin is required for flexible connected positioning strategy');

    let positionStrategy: FlexibleConnectedPositionStrategy;

    // Use the flexible connected positioning strategy based on the origin element
    positionStrategy = this.overlay.position().flexibleConnectedTo(config.connectedPositionOrigin);

    // Apply custom connected positions
    positionStrategy = positionStrategy.withPositions(config.conntectedPositions);

    return positionStrategy;
  }
}