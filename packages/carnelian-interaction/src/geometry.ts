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

export interface Line {
    a: Point;
    b: Point;
}

export interface Circle {
    center: Point;
    radius: number;
}

export interface Ellipse {
    center: Point;
    rx: number;
    ry: number;
}

export type Polygon = Point[];

export function sqr(x: number): number {
    return x * x;
}

export function clamp(x: number, a: number, b: number): number {
    return Math.max(a, Math.min(b, x));
}

export function distanceSquared(p1: Point, p2: Point): number{
    return sqr(p1.x - p2.x) + sqr(p1.y - p2.y);
}

export function distance(p1: Point, p2: Point): number {
    return Math.sqrt(distanceSquared(p1, p2));
}

export function segmentClosestPoint(p: Point, a: Point, b: Point): Point {
    const l = distanceSquared(a, b);
    if (l === 0) return a;
    const t = clamp(((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l, 0, 1);
    return {
        x: a.x + t * (b.x - a.x),
        y: a.y + t * (b.y - a.y)
    };
}

export function segmentDistanceSquared(p: Point, a: Point, b: Point): number {
    const l = distanceSquared(a, b);
    if (l === 0) return distanceSquared(p, a);
    const t = clamp(((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l, 0, 1);
    return distanceSquared(p, segmentClosestPoint(p, a, b));
}

export function segmentDistance(p: Point, a: Point, b: Point): number {
    return Math.sqrt(segmentDistanceSquared(p, a, b));
}

export function segmentBounds(a: Point, b: Point) {
    const x1 = Math.min(a.x, b.x);
    const y1 = Math.min(a.y, b.y);
    const x2 = Math.max(a.x, b.x);
    const y2 = Math.max(a.y, b.y);

    return {
        x: x1,
        y: y1,
        width: x2 - x1,
        height: y2 - y1
    }
}

export function pointInPolygon(p: Point, polygon: Polygon): boolean {
    const { x, y } = p;
    let result = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;
        
        const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        result = intersect ? !result : result;
    }
    return result;
}

export function pointInRect(p: Point, r: Rect): boolean {
    return p.x >= r.x && p.y >= r.y && p.x <= r.x + r.width && p.y <= r.y + r.height;
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

export function unionRect(a: Rect, b: Rect): Rect {
    const x1 = Math.min(a.x, b.x);
    const y1 = Math.min(a.y, b.y);
    const x2 = Math.max(a.x + a.width, b.x + b.width);
    const y2 = Math.max(a.y + a.height, b.y + b.height);

    return {
        x: x1,
        y: y1,
        width: x2 - x1,
        height: y2 - y1
    }
}

export function containsRect(a: Rect, b: Rect): boolean {
    return b.x >= a.x && b.x + b.width <= a.x + a.width && b.y >= a.y && b.y + b.height <= a.y + a.height;
}

export function intersectRects(rects: Rect[]): Rect | null {
    if (!rects) return null;
    const [first, ...rest] = rects;
    let result: Rect | null = first;
    for (let rect of rest) {
        if (!result) return null;
        result = intersectRect(result, rect);
    }
    return result;
}

export function unionRects(rects: Rect[]): Rect | null {
    if (!rects) return null;
    let [result, ...rest] = rects;
    for (let rect of rest) {
        result = unionRect(result, rect);
    }
    return result;
}

export function rectPoints(r: Rect): Point[] {
    return [
        {x: r.x, y: r.y},
        {x: r.x + r.width, y: r.y},
        {x: r.x + r.width, y: r.y + r.height},
        {x: r.x, y: r.y + r.height}
    ]
}

export function polygonBounds(polygon: Polygon): Rect | null {
    return unionRects(polygon.map(x => ({...x, width: 0, height: 0})));
}

export function pointOnSegment(p: Point, line: Line, tolerance: number) {
    return segmentDistance(p, line.a, line.b) <= tolerance;
}

export function pointOnCircle(p: Point, circle: Circle, tolerance: number) {
    return distanceSquared(p, circle.center) <= sqr(tolerance);
}

export function pointOnRect(p: Point, r: Rect, tolerance: number) {
    return (
        (Math.abs(p.x - r.x) <= tolerance && p.y >= r.y && p.y <= r.y + r.height) ||
        (Math.abs(p.y - r.y) <= tolerance && p.x >= r.x && p.x <= r.x + r.width) ||
        (Math.abs(p.x - r.x + r.width) <= tolerance && p.y >= r.y && p.y <= r.y + r.height) ||
        (Math.abs(p.y - r.y + r.height) <= tolerance && p.x >= r.x && p.x <= r.x + r.width)
    )
}

export function pointOnPolygon(p: Point, polygon: Polygon, tolerance: number) {
    return polygon.some((x, i) => {
        const next = i < polygon.length - 1 ? i + 1 : 0;
        return pointOnSegment(p, {a: x, b: polygon[next]}, tolerance);
    });
}