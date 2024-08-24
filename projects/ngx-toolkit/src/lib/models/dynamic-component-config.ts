import { ConnectedPosition, FlexibleConnectedPositionStrategyOrigin, OverlayConfig } from "@angular/cdk/overlay";
import { GlobalPosition } from "./global-position";

export interface DynamicComponentConfig {
    overlayConfig?: OverlayConfig;
    disableClose?: boolean;
    globalPosition?: GlobalPosition;
    data?: any;
    connectedPositionOrigin?: FlexibleConnectedPositionStrategyOrigin;
    conntectedPositions?: ConnectedPosition[];
}