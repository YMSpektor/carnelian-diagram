import { RenderableProps } from "../jsx-runtime";
import { DiagramNode, renderContext } from "..";

export type HitTestCallback = (point: DOMPointReadOnly, transform: DOMMatrixReadOnly) => boolean;
export type HitAreaDragHandler<P> = (curPos: DOMPointReadOnly, prevPos: DOMPointReadOnly, startPos: DOMPointReadOnly, update: (props: P) => void) => void;

export interface HitArea<P> {
    type: string;
    action: string;
    cursor?: string;
    onDrag?: HitAreaDragHandler<RenderableProps<P>>;
}

export type HitInfo<P> = {
    element: DiagramNode<P>;
    screenX: number;
    screenY: number;
    elementX: number;
    elementY: number;
    hitArea: HitArea<P>;
}

export interface DiagramElementHitTest<P = any> {
    element: DiagramNode<P>;
    callback: HitTestCallback;
    hitArea: HitArea<P>;
    priority: number;
}

export interface HitAreaCollection {
    [priority: number]: DiagramElementHitTest[];
}

export interface HitTestProps<P> {
    style?: {
        cursor: string;
    }
    __hitTest: {
        element: DiagramNode<P>;
        hitArea: HitArea<P>;
    }
}

export type HitTestEventTarget<P> = EventTarget & HitTestProps<P>;

export function hasHitTestProps<P>(target: EventTarget): target is HitTestEventTarget<P> {
    return (target as HitTestEventTarget<P>).__hitTest !== undefined;
}

export function createHitTestProps<P>(hitArea: HitArea<P>, element?: DiagramNode): HitTestProps<P> {
    const elem = element || renderContext.currentElement;
    if (!elem) {
        throw new Error("The createHitTestProps function is not allowed to be called from here. Current element is not defined");
    }
    return {
        style: hitArea.cursor ? {
            cursor: hitArea.cursor
        } : undefined,
        __hitTest: {
            element: elem, 
            hitArea
        }
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