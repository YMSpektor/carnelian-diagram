import { DiagramNode, renderContext } from "..";

export type HitTestCallback = (point: DOMPointReadOnly, transform: DOMMatrixReadOnly) => boolean;
export type HitAreaDragHandler<P> = (curPos: DOMPointReadOnly, prevPos: DOMPointReadOnly, startPos: DOMPointReadOnly, update: (props: P) => void) => void;

export interface HitArea<P> {
    type: string;
    cursor?: string;
    dragHandler?: HitAreaDragHandler<P>;
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

export function hitTest(e: MouseEvent, hitAreas: HitAreaCollection, transform: DOMMatrixReadOnly): HitInfo<unknown> | undefined {
    const point = new DOMPoint(e.clientX, e.clientY);
    if (e.target && hasHitTestProps(e.target)) {
        const elementPoint = point.matrixTransform(transform);
        return {
            ...e.target.__hitTest,
            screenX: point.x,
            screenY: point.y,
            elementX: elementPoint.x,
            elementY: elementPoint.y,
        }
    }
    else {
        const priorities = Object.keys(hitAreas).map(x => parseInt(x)).reverse();
        for (let priority of priorities) {
            const hit = hitAreas[priority].find(x => x.callback(point, transform));
            if (hit) {
                const elementPoint = point.matrixTransform(transform);
                return {
                    element: hit.element,
                    screenX: point.x,
                    screenY: point.y,
                    elementX: elementPoint.x,
                    elementY: elementPoint.y,
                    hitArea: hit.hitArea
                }
            }
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