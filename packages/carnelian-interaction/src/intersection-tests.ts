import { DiagramElementNode } from "@carnelian/diagram";
import { Rect, Collisions } from "./geometry";

export type IntersectionTestCallback = (selectionRect: Rect) => boolean;

export interface DiagramElementIntersectionTest {
    element: DiagramElementNode;
    callback: IntersectionTestCallback;
    bounds: Rect;
}

export function rectIntersectionTest(x: number, y: number, width: number, height: number): IntersectionTestCallback {
    return (selectionRect) => Collisions.rectRect(selectionRect, {x, y, width, height});
}

export function circleIntersectionTest(x: number, y: number, radius: number): IntersectionTestCallback {
    return (selectionRect) => Collisions.circleRect({x, y}, radius, selectionRect);
}