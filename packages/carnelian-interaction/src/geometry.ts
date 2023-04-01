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

export function approximateEllipse(ellipse: Ellipse, linesCount: number): Polygon {
    const result: Point[] = new Array(linesCount);
    for (var i = 0; i < linesCount; i++) {
        const a = Math.PI * 2 / linesCount * i;
        result[i] = {
            x: Math.cos(a) * ellipse.rx + ellipse.center.x,
            y: Math.sin(a) * ellipse.ry + ellipse.center.y
        }
    }
    return result;
}

export namespace Collisions {
    export function pointPoint(p1: Point, p2: Point, tolerance: number): boolean {
        return distanceSquared(p1, p2) <= sqr(tolerance);
    }

    export function pointLine(p: Point, line: Line, tolerance: number): boolean {
        return segmentDistance(p, line.a, line.b) <= tolerance;
    }

    export function pointCircle(p: Point, circle: Circle): boolean {
        return distanceSquared(p, circle.center) <= sqr(circle.radius);
    }

    export function pointRect(p: Point, r: Rect) {
        return p.x >= r.x && p.y >= r.y && p.x <= r.x + r.width && p.y <= r.y + r.height;
    }

    export function pointPolygon(p: Point, polygon: Polygon): boolean {
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

    export function lineLine(l1: Line, l2: Line): boolean {
        const {a: a1, b: b1} = l1;
        const {a: a2, b: b2} = l2;
        const u1 = ((b2.x-a2.x)*(a1.y-a2.y) - (b2.y-a2.y)*(a1.x-a2.x)) / ((b2.y-a2.y)*(b1.x-a1.x) - (b2.x-a2.x)*(b1.y-a1.y));
        const u2 = ((b1.x-a1.x)*(a1.y-a2.y) - (b1.y-a1.y)*(a1.x-a2.x)) / ((b2.y-a2.y)*(b1.x-a1.x) - (b2.x-a2.x)*(b1.y-a1.y));
        return u1 >= 0 && u1 <= 1 && u2 >= 0 && u2 <= 1;
    }

    export function lineRect(line: Line, rect: Rect): boolean {
        const points = rectPoints(rect);
        return (
            (pointRect(line.a, rect) && pointRect(line.b, rect)) ||
            lineLine(line, {a: points[0], b: points[1]}) ||
            lineLine(line, {a: points[1], b: points[2]}) ||
            lineLine(line, {a: points[2], b: points[3]}) ||
            lineLine(line, {a: points[3], b: points[0]})
        );
    }

    export function lineCircle(line: Line, circle: Circle): boolean {
        const sc = segmentClosestPoint(circle.center, line.a, line.b);
        return distanceSquared(circle.center, sc) <= sqr(circle.radius);   
    }

    export function linePolygon(line: Line, polygon: Polygon): boolean {
        if (pointPolygon(line.a, polygon) || pointPolygon(line.b, polygon)) {
            return true;
        }
        for (let i = 0; i < polygon.length; i++) {
            const next = i < polygon.length - 1 ? i + 1 : 0;
            if (lineLine(line, {a: polygon[i], b: polygon[next]})) {
                return true;
            }
        }
        return false;
    }

    export function circleCircle(c1: Circle, c2: Circle) {
        return distanceSquared(c1.center, c2.center) <= sqr(c1.radius + c2.radius);
    }

    export function circleRect(circle: Circle, rect: Rect): boolean {
        const points = rectPoints(rect);
        if (pointRect(circle.center, rect) || rectPoints(rect).some(p => pointCircle(p, circle))) {
            return true;
        }
        return (
            lineCircle({a: points[0], b: points[1]}, circle) ||
            lineCircle({a: points[1], b: points[2]}, circle) ||
            lineCircle({a: points[2], b: points[3]}, circle) ||
            lineCircle({a: points[3], b: points[0]}, circle)
        );
    }

    export function circlePolygon(circle: Circle, polygon: Polygon): boolean {
        if (pointPolygon(circle.center, polygon) || polygon.some(p => pointCircle(p, circle))) {
            return true;
        }
        for (let i = 0; i < polygon.length; i++) {
            const next = i < polygon.length - 1 ? i + 1 : 0;
            if (lineCircle({a: polygon[i], b: polygon[next]}, circle)) {
                return true;
            }
        }
        return false;
    }

    export function rectRect(a: Rect, b: Rect): boolean {
        return !!intersectRect(a, b);
    }

    export function rectPolygon(r: Rect, polygon: Polygon): boolean {
        if (rectPoints(r).some(p => pointPolygon(p, polygon)) || polygon.some(p => pointRect(p, r))) {
            return true;
        }
        for (let i = 0; i < polygon.length; i++) {
            const next = i < polygon.length - 1 ? i + 1 : 0;
            if (lineRect({a: polygon[i], b: polygon[next]}, r)) {
                return true;
            }
        }
        return false;
    }

    export function polygonPolygon(a: Polygon, b: Polygon): boolean {
        if (a.some(p => pointPolygon(p, b)) || b.some(p => pointPolygon(p, a))) {
            return true;
        }
        for (let i = 0; i < a.length; i++) {
            const next = i < a.length - 1 ? i + 1 : 0;
            if (linePolygon({a: a[i], b: a[next]}, b)) {
                return true;
            }
        }
        return false;
    }
}