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

export function rectPoints(r: Rect): Point[] {
    return [
        {x: r.x, y: r.y},
        {x: r.x + r.width, y: r.y},
        {x: r.x + r.width, y: r.y + r.height},
        {x: r.x, y: r.y + r.height}
    ]
}

export namespace Collisions {
    export function pointPolygon(p: Point, polygon: Point[]): boolean {
        const { x, y } = p;
        let resuil = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].x, yi = polygon[i].y;
            const xj = polygon[j].x, yj = polygon[j].y;
            
            const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            resuil = intersect ? !resuil : resuil;
        }
        
        return resuil;
    }

    export function pointLine(p: Point, a: Point, b: Point, tolerance: number): boolean {
        return segmentDistance(p, a, b) <= tolerance;
    }

    export function pointCircle(p: Point, c: Point, r: number): boolean {
        return distanceSquared(p, c) <= sqr(r);
    }

    export function pointRect(p: Point, r: Rect) {
        return p.x >= r.x && p.y >= r.y && p.x <= r.x + r.width && p.y <= r.y + r.height;
    }

    export function lineLine(a1: Point, b1: Point, a2: Point, b2: Point): boolean {
        const u1 = ((b2.x-a2.x)*(a1.y-a2.y) - (b2.y-a2.y)*(a1.x-a2.x)) / ((b2.y-a2.y)*(b1.x-a1.x) - (b2.x-a2.x)*(b1.y-a1.y));
        const u2 = ((b1.x-a1.x)*(a1.y-a2.y) - (b1.y-a1.y)*(a1.x-a2.x)) / ((b2.y-a2.y)*(b1.x-a1.x) - (b2.x-a2.x)*(b1.y-a1.y));
        return u1 >= 0 && u1 <= 1 && u2 >= 0 && u2 <= 1;
    }

    export function lineRect(a: Point, b: Point, r: Rect): boolean {
        const points = rectPoints(r);
        return (
            lineLine(a, b, points[0], points[1]) ||
            lineLine(a, b, points[1], points[2]) ||
            lineLine(a, b, points[2], points[3]) ||
            lineLine(a, b, points[3], points[0]) ||
            (pointRect(a, r) && pointRect(b, r))
        );
    }

    export function lineCircle(a: Point, b: Point, c: Point, r: number): boolean {
        const sc = segmentClosestPoint(c, a, b);
        return distanceSquared(c, sc) <= sqr(r);   
    }

    export function linePolygon(a: Point, b: Point, polygon: Point[]): boolean {
        if (pointPolygon(a, polygon) || pointPolygon(b, polygon)) {
            return true;
        }
        for (let i = 0; i < polygon.length; i++) {
            const next = i < polygon.length - 1 ? i + 1 : 0;
            if (lineLine(a, b, polygon[i], polygon[next])) {
                return true;
            }
        }
        return false;
    }

    export function circlePolygon(c: Point, r: number, polygon: Point[]): boolean {
        if (pointPolygon(c, polygon) || polygon.some(p => pointCircle(p, c, r))) {
            return true;
        }
        for (let i = 0; i < polygon.length; i++) {
            const next = i < polygon.length - 1 ? i + 1 : 0;
            if (lineCircle(polygon[i], polygon[next], c, r)) {
                return true;
            }
        }
        return false;
    }

    export function rectRect(a: Rect, b: Rect): boolean {
        return !!intersectRect(a, b);
    }

    export function rectPolygon(r: Rect, polygon: Point[]): boolean {
        if (rectPoints(r).some(p => pointPolygon(p, polygon)) || polygon.some(p => pointRect(p, r))) {
            return true;
        }
        for (let i = 0; i < polygon.length; i++) {
            const next = i < polygon.length - 1 ? i + 1 : 0;
            if (lineRect(polygon[i], polygon[next], r)) {
                return true;
            }
        }
        return false;
    }

    export function polygonPolygon(a: Point[], b: Point[]): boolean {
        if (a.some(p => pointPolygon(p, b)) || b.some(p => pointPolygon(p, a))) {
            return true;
        }
        for (let i = 0; i < a.length; i++) {
            const next = i < a.length - 1 ? i + 1 : 0;
            if (linePolygon(a[i], a[next], b)) {
                return true;
            }
        }
        return false;
    }
}