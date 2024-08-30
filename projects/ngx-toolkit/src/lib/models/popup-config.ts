import { Direction, Directionality } from "@angular/cdk/bidi";
import { PositionStrategy, ScrollStrategy } from "@angular/cdk/overlay";

export interface PopupConfig {
    positionStrategy?: PositionStrategy;
    scrollStrategy?: ScrollStrategy;
    panelClass?: string | string[];
    hasBackdrop?: boolean;
    backdropClass?: string | string[];
    width?: number | string;
    height?: number | string;
    minWidth?: number | string;
    minHeight?: number | string;
    maxWidth?: number | string;
    maxHeight?: number | string;
    direction?: Direction | Directionality;
    disposeOnNavigation?: boolean;
    disableClose?: boolean;
    data?: any;
}