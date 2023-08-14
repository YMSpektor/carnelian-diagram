import { MutableRefObject } from "@carnelian-diagram/core/utils/types";
import { HitArea } from "./hit-tests";
import { InteractionController } from "./interaction-controller";

export const ACT_MOVE = "move";
export const ACT_DRAW_POINT_PLACE = "draw_point:place";
export const ACT_DRAW_POINT_MOVE = "draw_point:move";
export const ACT_DRAW_POINT_CANCEL = "draw_point:cancel";
export const ACT_EDIT_TEXT = "edit_text";

export interface DragActionPayload {
    controller: InteractionController;
    position: DOMPointReadOnly;
    deltaX: number;
    deltaY: number;
    rawPosition: DOMPointReadOnly;
    rawDeltaX: number;
    rawDeltaY: number;
    hitArea: HitArea;
    snapGridSize: number | null | undefined;
    snapAngle: number | null | undefined;
    snapToGrid?: {
        (value: number, snapGridSize?: number | null): number;
        (point: DOMPointReadOnly, snapGridSize?: number | null): DOMPointReadOnly;
    }
}

export interface ClickActionPayload {
    controller: InteractionController;
    position: DOMPointReadOnly;
    rawPosition: DOMPointReadOnly;
    hitArea: HitArea;
    snapGridSize: number | null | undefined;
    snapAngle: number | null | undefined;
    snapToGrid?: {
        (value: number, snapGridSize?: number | null): number;
        (point: DOMPointReadOnly, snapGridSize?: number | null): DOMPointReadOnly;
    }
}

export type ACT_MOVE_Payload = DragActionPayload;

export interface ACT_DRAW_POINT_PLACE_Payload {
    controller: InteractionController;
    position: DOMPointReadOnly;
    rawPosition: DOMPointReadOnly;
    snapGridSize: number | null | undefined;
    snapAngle: number | null | undefined;
    snapToGrid?: {
        (value: number, snapGridSize?: number | null): number;
        (point: DOMPointReadOnly, snapGridSize?: number | null): DOMPointReadOnly;
    }
    pointIndex: number;
    result: MutableRefObject<boolean>;
}

export interface ACT_DRAW_POINT_MOVE_Payload {
    controller: InteractionController;
    position: DOMPointReadOnly;
    rawPosition: DOMPointReadOnly;
    snapGridSize: number | null | undefined;
    snapAngle: number | null | undefined;
    snapToGrid?: {
        (value: number, snapGridSize?: number | null): number;
        (point: DOMPointReadOnly, snapGridSize?: number | null): DOMPointReadOnly;
    }
    pointIndex: number;
}

export interface ACT_DRAW_POINT_CANCEL_Payload {
    controller: InteractionController;
    pointIndex: number;
    result: MutableRefObject<boolean>;
}

export type ACT_EDIT_TEXT_Payload = ClickActionPayload;