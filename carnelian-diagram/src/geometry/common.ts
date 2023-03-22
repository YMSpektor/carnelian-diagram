export interface Point {
    x: number;
    y: number;
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