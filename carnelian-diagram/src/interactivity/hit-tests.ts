import { DiagramNode, RenderContext, useContext } from "..";
import { CustomPropHook } from "../utils/custom-prop-hook";

export type HitTestCallback = (point: DOMPointReadOnly, transform: DOMMatrixReadOnly) => boolean;

export interface HitArea {
    type: string;
    index?: number;
    action: string;
    cursor?: string;
}

export type HitInfo = {
    element: DiagramNode;
    screenX: number;
    screenY: number;
    elementX: number;
    elementY: number;
    hitArea: HitArea;
}

export interface DiagramElementHitTest {
    element: DiagramNode;
    callback: HitTestCallback;
    hitArea: HitArea
    priority: number;
}

export interface HitAreaCollection {
    [priority: number]: DiagramElementHitTest[];
}

export interface HitTestProps {
    __hitTest: {
        element: DiagramNode;
        hitArea: HitArea;
    }
}

export type HitTestEventTarget = EventTarget & HitTestProps;

export function hasHitTestProps(target: EventTarget): target is HitTestEventTarget {
    return (target as HitTestEventTarget).__hitTest !== undefined;
}

export function createHitTestProps(hitArea: HitArea, element?: DiagramNode) {
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