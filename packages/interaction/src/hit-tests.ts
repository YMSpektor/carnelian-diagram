import { DiagramElementNode, RenderContext, useContext } from "@carnelian-diagram/core";
import { CustomPropHook } from "@carnelian-diagram/core/utils/custom-prop-hook";
import { distance, Point, pointInPolygon, pointInRect, Rect, segmentDistance } from "./geometry";

export type HitTestCallback = (point: DOMPointReadOnly, tolerance: number) => boolean;

export interface HitArea<T = any> {
    type: string;
    index?: number;
    cursor?: string;
    action?: string;
    dblClickAction?: string;
    data?: T;
}

export type HitInfo = {
    element: DiagramElementNode;
    screenX: number;
    screenY: number;
    elementX: number;
    elementY: number;
    hitArea: HitArea;
}

export interface DiagramElementHitTest {
    element: DiagramElementNode;
    callback: HitTestCallback;
    bounds: Rect | null;
    hitArea: HitArea;
    tolerance: number;
    priority: number;
}

export interface HitTestCollection {
    [priority: number]: Map<DiagramElementNode, Map<object, DiagramElementHitTest>> | undefined;
}

export interface HitTestProps {
    __hitTest: {
        element: DiagramElementNode;
        hitArea: HitArea;
    }
}

export type HitTestEventTarget = EventTarget & HitTestProps;
export type HitTestEvent = Event & HitTestProps;

export function hasHitTestProps(event: Event): event is HitTestEvent;
export function hasHitTestProps(target: EventTarget): target is HitTestEventTarget; 
export function hasHitTestProps(target: unknown): boolean {
    return (target as HitTestProps).__hitTest !== undefined;
}

export function addHitTestProps(e: Event, hitArea: HitArea, element: DiagramElementNode) {
    (e as HitTestEvent).__hitTest = { hitArea, element };
}

export function createHitTestProps(hitArea: HitArea, element?: DiagramElementNode) {
    const renderContext = useContext(RenderContext);
    const elem = element || renderContext?.currentElement;
    if (!elem) {
        throw new Error("The createHitTestProps function is not allowed to be called from here. Current element is not defined");
    }
    return {
        style: hitArea.cursor ? {
            cursor: hitArea.cursor
        } : undefined,
        __hitTest: new CustomPropHook({
            element: elem, 
            hitArea
        })
    }
}

export type CreateHitTestProps = ReturnType<typeof createHitTestProps>;

export function pointHitTest(x: number, y: number): HitTestCallback {
    return (point, tolerance) => {
        const p = { x, y };
        return Math.abs(p.x - point.x) <= tolerance && Math.abs(p.y - point.y) <= tolerance;
    }
}

export function rectHitTest(x: number, y: number, width: number, height: number): HitTestCallback {
    return (point) => {
        return pointInRect(point, { x, y, width, height });
    }
}

export function circleHitTest(x: number, y: number, radius: number): HitTestCallback {
    return (point) => {
        return distance(point, { x, y }) <= radius;
    }
}

export function lineHitTest(x1: number, y1: number, x2: number, y2: number): HitTestCallback {
    return (point, tolerance) => {
        return segmentDistance(point, { x: x1, y: y1 }, { x: x2, y: y2 }) <= tolerance;
    }
}

export function polygonHitTest(polygon: Point[]): HitTestCallback {
    return (point) => {
        return pointInPolygon(point, polygon);
    }
}