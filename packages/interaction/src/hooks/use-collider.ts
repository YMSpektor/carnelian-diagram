import { DiagramElementNode } from "@carnelian-diagram/core";
import { collide, Collider, PointCollider } from "../collisions/colliders";
import { HitArea, HitTestCallback } from "../hit-tests";
import { useHitTest, useIntersectionTest } from ".";
import { IntersectionTestCallback } from "../intersection-tests";
import { distance, transformPoint } from "../geometry";

export function useCollider<T>(collider: Collider<T>, hitArea: HitArea, tolerance: number = 0, priority: number = 0, 
    element?: DiagramElementNode
) {
    const hitTestCallback: HitTestCallback = (point, transform, tolerance) => {
        const elemPoint = point.matrixTransform(transform);
        const v1 = transformPoint({ x: 0, y: 0 }, transform);
        const v2 = transformPoint({ x: 1, y: 0 }, transform);
        const scale = distance(v1, v2);
        return !!collide(PointCollider(elemPoint), collider, tolerance * scale);
    }

    const intersectionTestCallback: IntersectionTestCallback = (selection) => {
        return !!collide(selection, collider, 0);
    }

    useHitTest(hitTestCallback, collider.bounds, hitArea, tolerance, priority, element);
    useIntersectionTest(intersectionTestCallback, collider.bounds);
}