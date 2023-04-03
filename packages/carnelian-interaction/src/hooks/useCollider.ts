import { DiagramElementNode } from "@carnelian/diagram";
import { collide, Collider, PointCollider, RectCollider } from "../collisions/colliders";
import { HitArea, HitTestCallback } from "../hit-tests";
import { useHitTest, useIntersectionTest } from ".";
import { IntersectionTestCallback } from "../intersection-tests";
import { pointInRect } from "../geometry";

export function useCollider<T>(collider: Collider<T>, hitArea: HitArea, priority: number = 0, 
    hitTestTolerance: number = 0, element?: DiagramElementNode
) {
    const hitTestCallback: HitTestCallback = (point, transform) => {
        const elemPoint = point.matrixTransform(transform);
        return (!collider.bounds || pointInRect(elemPoint, collider.bounds)) && !!collide(PointCollider(elemPoint), collider, hitTestTolerance);
    }

    const intersectionTestCallback: IntersectionTestCallback = (selectionRect) => {
        return !!collide(RectCollider(selectionRect), collider, 0);
    }

    useHitTest(hitTestCallback, hitArea, priority, element);
    useIntersectionTest(intersectionTestCallback, collider.bounds);
}