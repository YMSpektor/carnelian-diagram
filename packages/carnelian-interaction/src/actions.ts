import { MutableRefObject } from "@carnelian/diagram/utils/types";
import { HitArea } from "./hit-tests";

export const ACT_MOVE = "move";
export const ACT_DRAW_POINT_PLACE = "draw_point:place";
export const ACT_DRAW_POINT_MOVE = "draw_point:move";
export const ACT_DRAW_POINT_CANCEL = "draw_point:cancel";

export interface DragActionPayload {
    position: DOMPointReadOnly;
    deltaX: number;
    deltaY: number;
    rawPosition: DOMPointReadOnly;
    rawDeltaX: number;
    rawDeltaY: number;
    hitArea: HitArea;
    snapGridSize: number | null;
    snapAngle: number | null;
    snapToGrid: {
        (value: number, snapGridSize?: number | null): number;
        (point: DOMPointReadOnly, snapGridSize?: number | null): DOMPointReadOnly;
    }
}

export interface ClickActionPayload {
    position: DOMPointReadOnly;
    rawPosition: DOMPointReadOnly;
    hitArea: HitArea;
    snapGridSize: number | null;
    snapAngle: number | null;
    snapToGrid: {
        (value: number, snapGridSize?: number | null): number;
        (point: DOMPointReadOnly, snapGridSize?: number | null): DOMPointReadOnly;
    }
}

export type ACT_MOVE_Payload = DragActionPayload;

export interface ACT_DRAW_POINT_PLACE_Payload {
    position: DOMPointReadOnly;
    rawPosition: DOMPointReadOnly;
    snapGridSize: number | null;
    snapAngle: number | null;
    snapToGrid: {
        (value: number, snapGridSize?: number | null): number;
        (point: DOMPointReadOnly, snapGridSize?: number | null): DOMPointReadOnly;
    }
    pointIndex: number;
    result: MutableRefObject<boolean>;
}

export interface ACT_DRAW_POINT_MOVE_Payload {
    position: DOMPointReadOnly;
    rawPosition: DOMPointReadOnly;
    snapGridSize: number | null;
    snapAngle: number | null;
    snapToGrid: {
        (value: number, snapGridSize?: number | null): number;
        (point: DOMPointReadOnly, snapGridSize?: number | null): DOMPointReadOnly;
    }
    pointIndex: number;
}

export interface ACT_DRAW_POINT_CANCEL_Payload {
    pointIndex: number;
    result: MutableRefObject<boolean>;
}