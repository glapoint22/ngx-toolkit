import { FlexibleConnectedPositionStrategy, FlexibleConnectedPositionStrategyOrigin, GlobalPositionStrategy, Overlay, OverlayConfig } from '@angular/cdk/overlay';
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
    
    const overlayRef = this.overlay.create(new OverlayConfig(popupConfig));
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




  private createPortal<T>(componentOrTemplate: Type<T> | TemplateRef<any>, injector: Injector, viewContainerRef?: ViewContainerRef): ComponentPortal<T> | TemplatePortal<any> {
    if (componentOrTemplate instanceof TemplateRef) {
      const templateRef = componentOrTemplate as TemplateRef<any>;

      return new TemplatePortal(templateRef, viewContainerRef!, null, injector);
    } else {
      const component = componentOrTemplate as Type<T>;

      return new ComponentPortal(component, null, injector);
    }
  }




  public getGlobalPositionStrategy(): GlobalPositionStrategy {
    return this.overlay.position().global();
  }




  public getFlexiblePositionStrategy(connectedPositionOrigin: FlexibleConnectedPositionStrategyOrigin): FlexibleConnectedPositionStrategy {
    return this.overlay.position().flexibleConnectedTo(connectedPositionOrigin);
  }
}