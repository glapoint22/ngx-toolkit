import { ConnectedPosition, FlexibleConnectedPositionStrategyOrigin } from "@angular/cdk/overlay";
import { GlobalPosition } from "./global-position";

export interface PopupConfig {
    origin?: FlexibleConnectedPositionStrategyOrigin;
    connectedPositions?: ConnectedPosition[];
    globalPosition?: GlobalPosition;
    hasBackdrop?: boolean;
    backdropClass?: string | string[];
    width?: number | string;
    height?: number | string;
    minWidth?: number | string;
    minHeight?: number | string;
    maxWidth?: number | string;
    maxHeight?: number | string;
    disposeOnNavigation?: boolean;
    disableClose?: boolean;
    data?: any;
    closeOnScroll?: boolean;
    blockScroll?: boolean;
    repositionOnScroll?: boolean;
}