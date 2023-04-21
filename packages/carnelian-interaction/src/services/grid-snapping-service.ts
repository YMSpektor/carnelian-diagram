import { InteractionServive } from ".";

export interface GridSnappingService extends InteractionServive {
    type: "grid_snapping_service";
    snapGridSize: number | null;
    snapAngle: number | null;
    snapToGrid(value: number, snapGridSize?: number | null): number;
    snapToGrid(point: DOMPointReadOnly, snapGridSize?: number | null): DOMPointReadOnly;
}

export function isGridSnappingService(service: InteractionServive): service is GridSnappingService {
    return service.type === "grid_snapping_service";
}

export class DefaultGridSnappingService implements GridSnappingService {
    type: "grid_snapping_service" = "grid_snapping_service";

    constructor(public snapGridSize: number | null, public snapAngle: number | null) {}

    snapToGrid(value: number, snapGridSize?: number | null): number;
    snapToGrid(point: DOMPointReadOnly, snapGridSize?: number | null): DOMPointReadOnly;
    snapToGrid(value: DOMPointReadOnly | number, snapGridSize?: number | null): DOMPointReadOnly | number {
        snapGridSize = snapGridSize !== undefined ? snapGridSize : this.snapGridSize;
        if (typeof value === "number") {
            return snapGridSize ? Math.round(value / snapGridSize) * snapGridSize : value
        }
        else {
            return snapGridSize ? new DOMPoint(this.snapToGrid(value.x, snapGridSize), this.snapToGrid(value.y, snapGridSize)) : value;
        }
    }
}