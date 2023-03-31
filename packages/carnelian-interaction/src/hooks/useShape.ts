import { DiagramElementNode } from "@carnelian/diagram";
import { HitArea } from "../hit-tests";
import { Shape } from "../shapes";
import { useHitTest, useIntersectionTest } from ".";

export function useShape(shape: Shape, hitArea: HitArea, priority?: number, element?: DiagramElementNode) {
    useHitTest(shape.hitTestCallback, hitArea, priority, element);
    useIntersectionTest(shape.intersectionTestCallback, shape.bounds);
}