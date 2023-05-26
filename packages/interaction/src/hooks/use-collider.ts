import { DiagramElementNode } from "@carnelian-diagram/core";
import { collide, Collider, PointCollider } from "../collisions/colliders";
import { HitArea, HitTestCallback } from "../hit-tests";
import { useHitTest, useIntersectionTest } from ".";
import { IntersectionTestCallback } from "../intersection-tests";
import { distance, inflateRect, pointInRect, transformPoint } from "../geometry";

export function useCollider<T>(collider: Collider<T>, hitArea: HitArea, priority: number = 0, 
    hitTestTolerance: number = 0, element?: DiagramElementNode
) {
    const hitTestCallback: HitTestCallback = (point, transform) => {
        const elemPoint = point.matrixTransform(transform);
        const v1 = transformPoint({ x: 0, y: 0 }, transform);
        const v2 = transformPoint({ x: 1, y: 0 }, transform);
        const scale = distance(v1, v2);
        const tolerance = hitTestTolerance * scale;
        const bounds = collider.bounds ? inflateRect(collider.bounds, tolerance) : null;
        return (!bounds || pointInRect(elemPoint, bounds)) && !!collide(PointCollider(elemPoint), collider, tolerance);
    }

    const intersectionTestCallback: IntersectionTestCallback = (selection) => {
        return !!collide(selection, collider, 0);
    }

    useHitTest(hitTestCallback, hitArea, priority, element);
    useIntersectionTest(intersectionTestCallback, collider.bounds);
}