import { ConnectedPosition, FlexibleConnectedPositionStrategyOrigin } from "@angular/cdk/overlay";
import { GlobalPosition } from "./global-position";

export interface DynamicComponentConfig {
    hasBackdrop?: boolean;
    backdropClass?: string | string[];
    disableClose?: boolean;
    width?: string;
    height?: string;
    minWidth?: number | string;
    minHeight?: number | string;
    maxWidth?: number | string;
    maxHeight?: number | string;
    globalPosition?: GlobalPosition;
    data?: any;
    useFlexiblePositioning?: boolean;
    origin?: FlexibleConnectedPositionStrategyOrigin;
    conntectedPositions?: ConnectedPosition[];
}