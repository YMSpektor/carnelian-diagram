import { clamp, distanceSquared, Point } from "./common";

export function segmentDistanceSquared(p: Point, a: Point, b: Point) {
    const l = distanceSquared(a, b);
    if (l === 0) return distanceSquared(p, a);
    const t = clamp(((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l, 0, 1);
    return distanceSquared(p, {
        x: a.x + t * (b.x - a.x),
        y: a.y + t * (b.y - a.y)
    });
}

export function segmentDistance(p: Point, a: Point, b: Point) {
    return Math.sqrt(segmentDistanceSquared(p, a, b));
}