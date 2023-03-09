import { DiagramNode } from "..";

export interface HitArea {
    hitTest(point: DOMPointReadOnly, transform: DOMMatrixReadOnly): boolean;
}

export type HitInfo = {
    element: DiagramNode;
    screenX: number;
    screenY: number;
    elementX: number;
    elementY: number;
    hitArea: HitArea;
}

interface HitAreaCollection {
    [priority: number]: { element: DiagramNode, hitArea: HitArea }[];
}

export class HitTests {
    private  hitAreas: HitAreaCollection = {};

    reset() {
        this.hitAreas = {};
    }

    addHitArea(element: DiagramNode, priority: number, hitArea: HitArea) {
        let arr = this.hitAreas[priority];
        if (!arr) {
            arr = [];
            this.hitAreas[priority] = arr;
        }
        arr.push({element, hitArea});
    }

    hitTest(point: DOMPointReadOnly, transform: DOMMatrixReadOnly): HitInfo | undefined {
        const priorities = Object.keys(this.hitAreas).map(x => parseInt(x)).reverse();
        for (let priority of priorities) {
            const hit = this.hitAreas[priority].find(x => x.hitArea.hitTest(point, transform));
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