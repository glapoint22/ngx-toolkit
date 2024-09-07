import { FlexibleConnectedPositionStrategy, GlobalPositionStrategy, Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { inject, Injectable, Injector, TemplateRef, Type, ViewContainerRef } from '@angular/core';
import { PopupConfig } from '../../models/popup-config';
import { POPUP_DATA } from '../../types/popup-data';
import { PopupRef } from '../../models/popup-ref';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private overlay = inject(Overlay);
  private injector = inject(Injector);



  public open<T>(templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef, popupConfig?: PopupConfig): PopupRef<T>;




  public open<T>(component: Type<T>, popupConfig?: PopupConfig): PopupRef<T>;





  public open<T>(
    templateRefOrComponent: TemplateRef<any> | Type<T>,
    viewContainerRefOrPopupConfig?: ViewContainerRef | PopupConfig,
    popupConfig?: PopupConfig
  ): PopupRef<T> {

    const viewContainerRef = viewContainerRefOrPopupConfig instanceof ViewContainerRef ? viewContainerRefOrPopupConfig : undefined;

    popupConfig = viewContainerRef ? popupConfig : viewContainerRefOrPopupConfig as PopupConfig;

    const overlyConfig = this.getOverlayConfig(popupConfig);
    const overlayRef = this.overlay.create(overlyConfig);
    const popupRef = new PopupRef<T>(overlayRef, popupConfig);

    const popupInjector = Injector.create({
      providers: [
        { provide: POPUP_DATA, useValue: popupConfig?.data },
        { provide: PopupRef, useValue: popupRef }
      ],
      parent: this.injector
    });

    const portal = this.createPortal(templateRefOrComponent, popupInjector, viewContainerRef);
    const componentRef = overlayRef.attach(portal);

    popupRef.instance = componentRef.instance;
    popupRef.componentRef = componentRef;

    return popupRef;
  }


  private getOverlayConfig(popupConfig?: PopupConfig): OverlayConfig {
    const config = new OverlayConfig();

    config.positionStrategy = this.getPositionStrategy(popupConfig);
    config.scrollStrategy = this.getScrollStrategy(popupConfig);
    config.hasBackdrop = popupConfig?.hasBackdrop;
    config.backdropClass = popupConfig?.backdropClass;
    config.width = popupConfig?.width;
    config.height = popupConfig?.height;
    config.minWidth = popupConfig?.minWidth;
    config.minHeight = popupConfig?.minHeight;
    config.maxWidth = popupConfig?.maxWidth;
    config.maxHeight = popupConfig?.maxHeight;
    config.disposeOnNavigation = popupConfig?.disposeOnNavigation;

    return config;
  }



  private getScrollStrategy(popupConfig?: PopupConfig): any {
    if (popupConfig?.blockScroll) {
      return this.overlay.scrollStrategies.block();
    } else if (popupConfig?.closeOnScroll) {
      return this.overlay.scrollStrategies.close();
    } else if (popupConfig?.repositionOnScroll) {
      return this.overlay.scrollStrategies.reposition();
    } else {
      return undefined;
    }
  }



  private getPositionStrategy(popupConfig?: PopupConfig): GlobalPositionStrategy | FlexibleConnectedPositionStrategy {
    if (popupConfig?.origin) {
      return this.getFlexiblePositionStrategy(popupConfig);
    }

    return this.getGlobalPositionStrategy(popupConfig);
  }



  private getFlexiblePositionStrategy(popupConfig?: PopupConfig): FlexibleConnectedPositionStrategy {
    const conntectedPositions = popupConfig?.connectedPositions || [
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

    return this.overlay.position().flexibleConnectedTo(popupConfig?.origin!)
      .withPositions(conntectedPositions);
  }



  private getGlobalPositionStrategy(config?: PopupConfig): GlobalPositionStrategy {
    let positionStrategy: GlobalPositionStrategy = this.overlay.position().global();

    // Handle vertical positioning
    if (config?.globalPosition?.top !== undefined) {
      positionStrategy = positionStrategy.top(config.globalPosition.top);
    } else if (config?.globalPosition?.bottom !== undefined) {
      positionStrategy = positionStrategy.bottom(config.globalPosition.bottom);
    } else {
      positionStrategy = positionStrategy.centerVertically();
    }

    // Handle horizontal positioning
    if (config?.globalPosition?.left !== undefined) {
      positionStrategy = positionStrategy.left(config.globalPosition.left);
    } else if (config?.globalPosition?.right !== undefined) {
      positionStrategy = positionStrategy.right(config.globalPosition.right);
    } else {
      positionStrategy = positionStrategy.centerHorizontally();
    }

    return positionStrategy;
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
}