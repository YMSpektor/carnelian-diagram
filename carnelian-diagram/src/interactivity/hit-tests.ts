import { DiagramNode, renderContext } from "..";

export type HitTestCallback = (point: DOMPointReadOnly, transform: DOMMatrixReadOnly) => boolean;

export interface HitArea {
    type: string;
}

export type HitInfo = {
    element: DiagramNode;
    screenX: number;
    screenY: number;
    elementX: number;
    elementY: number;
    hitArea: HitArea;
}

export interface HitTestProps {
    __hitTest: {
        element: DiagramNode;
        hitArea: HitArea;
    }
}

export type HitTestEventTarget = EventTarget & HitTestProps;

export function hasHitArea(target: EventTarget): target is HitTestEventTarget {
    return (target as HitTestEventTarget).__hitTest !== undefined;
}

export function createHitTestProps(hitArea: HitArea, element?: DiagramNode): HitTestProps {
    const elem = element || renderContext.currentElement;
    if (!elem) {
        throw new Error("The createHitTestProps function is not allowed to be called from here. Current element is not defined");
    }
    return {
        __hitTest: {
            element: elem, 
            hitArea
        }
    }
}

interface HitAreaCollection {
    [priority: number]: { element: DiagramNode, callback: HitTestCallback, hitArea: HitArea }[];
}

export class HitTests {
    private  hitAreas: HitAreaCollection = {};

    reset() {
        this.hitAreas = {};
    }

    addHitArea(element: DiagramNode, callback: HitTestCallback, hitArea: HitArea, priority: number) {
        let arr = this.hitAreas[priority];
        if (!arr) {
            arr = [];
            this.hitAreas[priority] = arr;
        }
        arr.push({element, callback, hitArea});
    }

    hitTest(point: DOMPointReadOnly, transform: DOMMatrixReadOnly): HitInfo | undefined {
        const priorities = Object.keys(this.hitAreas).map(x => parseInt(x)).reverse();
        for (let priority of priorities) {
            const hit = this.hitAreas[priority].find(x => x.callback(point, transform));
            if (hit) {
                const elementPoint = point.matrixTransform(transform);
                return {
                    ...hit,
                    screenX: point.x,
                    screenY: point.y,
                    elementX: elementPoint.x,
                    elementY: elementPoint.y
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