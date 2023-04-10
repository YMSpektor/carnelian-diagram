import { DiagramElementNode, RenderContext, useContext } from "@carnelian/diagram";
import { CustomPropHook } from "@carnelian/diagram/utils/custom-prop-hook";
import { distance, Point, pointInPolygon, segmentDistance } from "./geometry";

export type HitTestCallback = (point: DOMPointReadOnly, transform: DOMMatrixReadOnly) => boolean;

export interface HitArea<T = any> {
    type: string;
    index?: number;
    action: string;
    cursor?: string;
    overrideGridSnapping?: (snapGridSize: number | null) => number | null;
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
    hitArea: HitArea,
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

export function hasHitTestProps(target: EventTarget): target is HitTestEventTarget {
    return (target as HitTestEventTarget).__hitTest !== undefined;
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

export function pointHitTest(x: number, y: number, tolerance: number): HitTestCallback {
    return (point, transform) => {
        const p = new DOMPoint(x, y).matrixTransform(transform.inverse());
        return Math.abs(p.x - point.x) <= tolerance && Math.abs(p.y - point.y) <= tolerance;
    }
}

export function rectHitTest(x: number, y: number, width: number, height: number): HitTestCallback {
    return (point, transform) => {
        const elemPoint = point.matrixTransform(transform);
        return elemPoint.x >= x && elemPoint.y >= y && elemPoint.x <= x + width && elemPoint.y <= y + height;
    }
}

export function circleHitTest(x: number, y: number, radius: number): HitTestCallback {
    return (point, transform) => {
        const elemPoint = point.matrixTransform(transform);
        return distance(elemPoint, {x, y}) <= radius;
    }
}

export function lineHitTest(x1: number, y1: number, x2: number, y2: number, tolerance: number): HitTestCallback {
    return (point, transform) => {
        const p1 = new DOMPoint(x1, y1).matrixTransform(transform.inverse());
        const p2 = new DOMPoint(x2, y2).matrixTransform(transform.inverse());
        const d = segmentDistance(point, p1, p2);
        return d <= tolerance;
    }
}

export function polygonHitTest(polygon: Point[]): HitTestCallback {
    return (point, transform) => {
        const elemPoint = point.matrixTransform(transform);
        return pointInPolygon(elemPoint, polygon);
    }
}