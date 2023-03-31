import { DiagramElementNode } from "@carnelian/diagram";
import { intersectRect, Rect } from "./geometry";

export type IntersectionTestCallback = (selectionRect: Rect) => boolean;

export interface DiagramElementIntersectionTest {
    element: DiagramElementNode;
    callback: IntersectionTestCallback;
}

export function rectIntersectionTest(x: number, y: number, width: number, height: number): IntersectionTestCallback {
    return (selectionRect) => !!intersectRect(selectionRect, {x, y, width, height});
}