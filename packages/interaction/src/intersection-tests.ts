import { DiagramElementNode } from "@carnelian-diagram/core";
import { CircleCollider, collide, Collider, LineCollider, PolygonCollider, RectCollider } from "./collisions";
import { Point, Rect } from "./geometry";

export type IntersectionTestCallback = (selection: Collider<any>) => boolean;

export interface DiagramElementIntersectionTest {
    element: DiagramElementNode;
    callback: IntersectionTestCallback;
    bounds: Rect | null;
}

export function lineIntersectionTest(x1: number, y1: number, x2: number, y2: number): IntersectionTestCallback {
    return (selection) => !!collide(LineCollider({a: {x: x1, y: y1}, b: {x: x2, y: y2}}), selection);
}

export function rectIntersectionTest(x: number, y: number, width: number, height: number): IntersectionTestCallback {
    return (selection) => !!collide(RectCollider({x, y, width, height}), selection);
}

export function circleIntersectionTest(x: number, y: number, radius: number): IntersectionTestCallback {
    return (selection) => !!collide(CircleCollider({center: {x, y}, radius}), selection);
}

export function polygonIntersectionTest(points: Point[]): IntersectionTestCallback {
    return (selection) => !!collide(PolygonCollider(points), selection);
}