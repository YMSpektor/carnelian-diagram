import { DiagramElementNode } from "@carnelian/diagram";
import { Rect, Collisions } from "./geometry";

export type IntersectionTestCallback = (selectionRect: Rect) => boolean;

export interface DiagramElementIntersectionTest {
    element: DiagramElementNode;
    callback: IntersectionTestCallback;
}

export function rectIntersectionTest(x: number, y: number, width: number, height: number): IntersectionTestCallback {
    return (selectionRect) => Collisions.rectRect(selectionRect, {x, y, width, height});
}