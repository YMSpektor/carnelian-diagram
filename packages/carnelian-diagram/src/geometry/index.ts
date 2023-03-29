export interface Point {
    x: number;
    y: number;
}

export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function sqr(x: number) {
    return x * x;
}

export function clamp(x: number, a: number, b: number) {
    return Math.max(a, Math.min(b, x));
}

export function distanceSquared(p1: Point, p2: Point) {
    return sqr(p1.x - p2.x) + sqr(p1.y - p2.y);
}

export function distance(p1: Point, p2: Point) {
    return Math.sqrt(distanceSquared(p1, p2));
}

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

export function intersectRect(a: Rect, b: Rect): Rect | null {
    const x1 = Math.max(a.x, b.x);
    const x2 = Math.min(a.x + a.width, b.x + b.width);
    if (x2 < x1) {
        return null;
    }

    const y1 = Math.max(a.y, b.y);
    const y2 = Math.min(a.y + a.height, b.y + b.height);
    if (y2 < y1) {
        return null;
    }

    return {
        x: x1,
        y: y1,
        width: x2 - x1,
        height: y2 - y1,
    };
}