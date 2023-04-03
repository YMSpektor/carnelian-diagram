import { DiagramElementNode } from "@carnelian/diagram";
import { CollisionFunctions } from "./collisions";
import { Point, Rect } from "./geometry";

export type IntersectionTestCallback = (selectionRect: Rect) => boolean;

export interface DiagramElementIntersectionTest {
    element: DiagramElementNode;
    callback: IntersectionTestCallback;
    bounds: Rect | null;
}

export function lineIntersectionTest(x1: number, y1: number, x2: number, y2: number): IntersectionTestCallback {
    return (selectionRect) => !!CollisionFunctions.lineRect({a: {x: x1, y: y1}, b: {x: x2, y: y2}}, selectionRect);
}

export function rectIntersectionTest(x: number, y: number, width: number, height: number): IntersectionTestCallback {
    return (selectionRect) => !!CollisionFunctions.rectRect(selectionRect, {x, y, width, height});
}

export function circleIntersectionTest(x: number, y: number, radius: number): IntersectionTestCallback {
    return (selectionRect) => !!CollisionFunctions.circleRect({center: {x, y}, radius}, selectionRect);
}

export function polygonIntersectionTest(points: Point[]): IntersectionTestCallback {
    return (selectionRect) => !!CollisionFunctions.rectPolygon(selectionRect, points);
}