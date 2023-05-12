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

export function degToRad(angle: number): number {
    return angle * Math.PI / 180;
}

export function radToDeg(angle: number): number {
    return angle * 180 / Math.PI;
}

export function distanceSquared(p1: Point, p2: Point): number {
    return sqr(p1.x - p2.x) + sqr(p1.y - p2.y);
}

export function distance(p1: Point, p2: Point): number {
    return Math.sqrt(distanceSquared(p1, p2));
}

export function lineClosestPoint(p: Point, a: Point, b: Point): Point {
    let l = distanceSquared(a, b);
    if (l === 0) {
        b = { ...b };
        b.x = a.x + 1;
        l = 1;
    }
    const t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l;
    return {
        x: a.x + t * (b.x - a.x),
        y: a.y + t * (b.y - a.y)
    };
}

export function lineDistanceSquared(p: Point, a: Point, b: Point): number {
    return distanceSquared(p, lineClosestPoint(p, a, b));
}

export function lineDistance(p: Point, a: Point, b: Point): number {
    return Math.sqrt(lineDistanceSquared(p, a, b));
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

export function intersectLines(a: Line, b: Line, inf1: boolean, inf2: boolean): Point | null {
    const { x: x1, y: y1 } = a.a;
    const { x: x2, y: y2 } = a.b;
    const { x: x3, y: y3 } = b.a;
    const { x: x4, y: y4 } = b.b;
    const d = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (d === 0) {
        return null;
    }
    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / d;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / d;
    const p = { x: x1 + (x2 - x1) * ua, y: y1 + (y2 - y1) * ua };
    return (
        (inf1 && inf2) || 
        (inf1 && ub >= 0 && ub <= 1) ||
        (inf2 && ua >= 0 && ua <= 1) ||
        (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1)
    ) ? p : null;
}

export function extendLine(l: Line, r: Rect): Line {
    function extend(a: Point, b: Point, r: Rect): Point {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const e = {
            x: dx > 0 ? r.x + r.width : r.x,
            y: dy > 0 ? r.y + r.height : r.y
        }
        if (dx === 0) {
            return { x: a.x, y: e.y }
        }
        if (dy === 0) {
            return { x: e.x, y: a.y }
        }
        const tx = (e.x - a.x) / dx;
        const ty = (e.y - a.y) / dy;
        return {
            x: tx <= ty ? e.x : a.x + ty * dx,
            y: tx <= ty ? a.y + tx * dy : e.y
        }
    }

    return {
        a: extend(l.b, l.a, r),
        b: extend(l.a, l.b, r)
    }
}

export function pointInCircle(p: Point, circle: Circle): boolean {
    return distanceSquared(p, circle.center) <= sqr(circle.radius);
}

export function pointInEllipse(p: Point, e: Ellipse): boolean {
    if (e.rx === 0) {
        return p.x == e.center.x && p.y >= e.center.y - e.ry && p.y <= e.center.y + e.ry;
    }
    if (e.ry === 0) {
        return p.y == e.center.y && p.x >= e.center.x - e.rx && p.x <= e.center.x + e.rx;
    }
    const t = sqr(p.x - e.center.x) / sqr(e.rx) + sqr(p.y - e.center.y) / sqr(e.ry);
    return t <= 1;
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

export function pointInHalfplane(p: Point, a: Point, b: Point): boolean {
    return ((b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x)) >= 0;
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

export function inflateRect(r: Rect, value: number): Rect {
    return {
        x: r.x - value,
        y: r.y - value,
        width: r.width + value * 2,
        height: r.height + value * 2
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
        { x: r.x, y: r.y },
        { x: r.x + r.width, y: r.y },
        { x: r.x + r.width, y: r.y + r.height },
        { x: r.x, y: r.y + r.height }
    ]
}

export function lineBounds(line: Line) {
    const x1 = Math.min(line.a.x, line.b.x);
    const y1 = Math.min(line.a.y, line.b.y);
    const x2 = Math.max(line.a.x, line.b.x);
    const y2 = Math.max(line.a.y, line.b.y);

    return {
        x: x1,
        y: y1,
        width: x2 - x1,
        height: y2 - y1
    }
}

export function circleBounds(c: Circle): Rect {
    return {
        x: c.center.x - c.radius,
        y: c.center.y - c.radius,
        width: c.radius * 2,
        height: c.radius * 2
    }
}

export function ellipseBounds(e: Ellipse): Rect {
    return {
        x: e.center.x - e.rx,
        y: e.center.y - e.ry,
        width: e.rx * 2,
        height: e.ry * 2
    }
}

export function polygonBounds(polygon: Polygon): Rect | null {
    return unionRects(polygon.map(x => ({ ...x, width: 0, height: 0 })));
}

export function pointOnSegment(p: Point, line: Line, tolerance: number) {
    return segmentDistance(p, line.a, line.b) <= tolerance;
}

export function pointOnLine(p: Point, line: Line, tolerance: number) {
    return lineDistance(p, line.a, line.b) <= tolerance;
}

export function pointOnCircle(p: Point, circle: Circle, tolerance: number) {
    return Math.abs(distance(p, circle.center) - circle.radius) <= tolerance;
}

export function pointOnRect(p: Point, r: Rect, tolerance: number) {
    return (
        (Math.abs(p.x - r.x) <= tolerance && p.y >= r.y && p.y <= r.y + r.height) ||
        (Math.abs(p.y - r.y) <= tolerance && p.x >= r.x && p.x <= r.x + r.width) ||
        (Math.abs(p.x - r.x + r.width) <= tolerance && p.y >= r.y && p.y <= r.y + r.height) ||
        (Math.abs(p.y - r.y + r.height) <= tolerance && p.x >= r.x && p.x <= r.x + r.width)
    )
}

export function pointOnEllipse(p: Point, e: Ellipse, tolerance: number): boolean {
    if (e.rx <= tolerance) {
        return Math.abs(p.x - e.center.x) <= tolerance && p.y >= e.center.y - e.ry && p.y <= e.center.y + e.ry;
    }
    if (e.ry <= tolerance) {
        return Math.abs(p.y - e.center.y) <= tolerance && p.x >= e.center.x - e.rx && p.x <= e.center.x + e.rx;
    }
    const t1 = sqr(p.x - e.center.x) / sqr(e.rx - tolerance) + sqr(p.y - e.center.y) / sqr(e.ry - tolerance);
    const t2 = sqr(p.x - e.center.x) / sqr(e.rx + tolerance) + sqr(p.y - e.center.y) / sqr(e.ry + tolerance);
    return t1 >= 1 && t2 <= 1;
}

export function pointOnPolygon(p: Point, polygon: Polygon, tolerance: number) {
    return polygon.some((x, i) => {
        const next = i < polygon.length - 1 ? i + 1 : 0;
        return pointOnSegment(p, { a: x, b: polygon[next] }, tolerance);
    });
}