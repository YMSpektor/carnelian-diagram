import { DiagramElementNode } from "@carnelian-diagram/core";
import { collide, Collider, PointCollider } from "../collisions/colliders";
import { HitArea, HitTestCallback } from "../hit-tests";
import { useHitTest, useIntersectionTest } from ".";
import { IntersectionTestCallback } from "../intersection-tests";

export function useCollider<T>(collider: Collider<T>, hitArea: HitArea, tolerance: number = 0, priority: number = 0, 
    element?: DiagramElementNode
) {
    const hitTestCallback: HitTestCallback = (point, tolerance) => {
        return !!collide(PointCollider(point), collider, tolerance);
    }

    const intersectionTestCallback: IntersectionTestCallback = (selection) => {
        return !!collide(selection, collider, 0);
    }

    useHitTest(hitTestCallback, collider.bounds, hitArea, tolerance, priority, element);
    useIntersectionTest(intersectionTestCallback, collider.bounds);
}