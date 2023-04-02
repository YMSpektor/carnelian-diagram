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

export type CollisionResult = null | {
    inside: boolean;
    contains: boolean;
    points: Point[];
}

export function flipCollisionResult(result: CollisionResult): CollisionResult {
    if (result) {
        const {inside, contains, points} = result;
        result = {inside: contains, contains: inside, points};
    }
    return result;
}

export function invertCollisionResult(result: CollisionResult): CollisionResult {
    if (result === null) {
        return {
            inside: false,
            contains: true,
            points: []
        }
    }
    else if (result.contains) {
        return null;
    }
    else if (result.inside) {
        return {
            inside: false,
            contains: false,
            points: result.points
        }
    }
    else return {...result}
}

export namespace Collisions {
    export function pointPoint(p1: Point, p2: Point, tolerance: number): CollisionResult {
        const result = distanceSquared(p1, p2) <= sqr(tolerance);
        return result ? {
            inside: true,
            contains: true,
            points: []
        } : null
    }

    export function pointLine(p: Point, line: Line, tolerance: number): CollisionResult {
        const result = segmentDistance(p, line.a, line.b) <= tolerance;
        return result ? {
            inside: true,
            contains: false,
            points: []
        } : null
    }

    export function pointCircle(p: Point, circle: Circle): CollisionResult {
        const result = distanceSquared(p, circle.center) <= sqr(circle.radius);
        if (result) {
            const inside = !pointOnCircle(p, circle, 0.01);
            return {
                inside,
                contains: false,
                points: inside ? [] : [p]
            }
        }
        return null;
    }

    export function pointRect(p: Point, r: Rect): CollisionResult {
        const result = p.x >= r.x && p.y >= r.y && p.x <= r.x + r.width && p.y <= r.y + r.height;
        if (result) {
            const inside = !pointOnRect(p, r, 0.01);
            return {
                inside,
                contains: false,
                points: inside ? [] : [p]
            }
        }
        return null;

    }

    export function pointPolygon(p: Point, polygon: Polygon): CollisionResult {
        const { x, y } = p;
        let result = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].x, yi = polygon[i].y;
            const xj = polygon[j].x, yj = polygon[j].y;
            
            const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            result = intersect ? !result : result;
        }
        
        if (result) {
            const inside = !pointOnPolygon(p, polygon, 0.01);
            return {
                inside,
                contains: false,
                points: inside ? [] : [p]
            }
        }
        return null;
    }

    export function lineLine(l1: Line, l2: Line): CollisionResult {
        const {a: a1, b: b1} = l1;
        const {a: a2, b: b2} = l2;
        const d = ((b2.y-a2.y)*(b1.x-a1.x) - (b2.x-a2.x)*(b1.y-a1.y));
        if (d === 0) {
            return null;
        }
        const u1 = ((b2.x-a2.x)*(a1.y-a2.y) - (b2.y-a2.y)*(a1.x-a2.x)) / d;
        const u2 = ((b1.x-a1.x)*(a1.y-a2.y) - (b1.y-a1.y)*(a1.x-a2.x)) / d;
        const result = u1 >= 0 && u1 <= 1 && u2 >= 0 && u2 <= 1;
        return result ? {
            inside: false,
            contains: false,
            points: [{x: a1.x + (b1.x - a1.x) * u1, y: a1.y + (b1.y - a1.y) * u1}]
        } : null;
    }

    export function lineRect(line: Line, rect: Rect): CollisionResult {
        if (pointRect(line.a, rect) && pointRect(line.b, rect)) {
            return {
                inside: true,
                contains: false,
                points: []
            }
        }
        else {
            const points = rectPoints(rect);
            const pts = points.reduce<Point[]>((acc, p, i) => {
                const next = i < points.length - 1 ? i + 1 : 0;
                const result = lineLine({a: p, b: points[next]}, line);
                return result ? acc.concat(result.points) : acc
            }, []);
            return pts.length ? {
                inside: false,
                contains: false,
                points: pts
            } : null
        }
    }

    export function lineCircle(line: Line, circle: Circle): CollisionResult {
        const { a, b } = line;
        if (pointCircle(a, circle) && pointCircle(b, circle)) {
            return {
                inside: true,
                contains: false,
                points: []
            }
        }
        else {
            const { center: c, radius: r } = circle;
            const l = distance(a, b);
            if (l === 0) {
                return pointCircle(a, circle);
            }
            const dx = (b.x - a.x) / l;
            const dy = (b.y - a.y) / l;
            const t = dx * (c.x - a.x) + dy * (c.y - a.y);
            const ex = t * dx + a.x;
            const ey = t * dy + a.y;
            const d = distanceSquared(c, {x: ex, y: ey});
            const rr = r * r;
            let pts: Point[] = [];
            if (d <= rr) {
                const dt = Math.sqrt(rr - d);
                if (t - dt >= 0 && t - dt <= l) {
                    pts.push({x: (t - dt) * dx + a.x, y: (t - dt) * dy + a.y});
                }
                if (t + dt >= 0 && t + dt <= l) {
                    pts.push({x: (t + dt) * dx + a.x, y: (t + dt) * dy + a.y});
                }
            }
            return pts.length ? {
                inside: false,
                contains: false,
                points: pts
            } : null
        } 
    }

    export function linePolygon(line: Line, polygon: Polygon): CollisionResult {
        const pts = polygon.reduce<Point[]>((acc, p, i) => {
            const next = i < polygon.length - 1 ? i + 1 : 0;
            const result = lineLine(line, {a: p, b: polygon[next]});
            return result ? acc.concat(result.points) : acc
        }, []);

        return {
            inside: !pts.length && !!pointPolygon(line.a, polygon) && !!pointPolygon(line.b, polygon),
            contains: false,
            points: pts
        }
    }

    export function circleCircle(c1: Circle, c2: Circle): CollisionResult {
        const d = distance(c1.center, c2.center);
        if (d > c1.radius + c2.radius) {
            return null;
        }
        const inside = d <= c2.radius - c1.radius;
        const contains = d <= c1.radius - c2.radius;
        if (inside || contains) {
            return {inside, contains, points: []}
        }
        else {
            const a = (sqr(c1.radius) - sqr(c2.radius) + sqr(d)) / (2 * d);
            const h = Math.sqrt(sqr(c1.radius) - sqr(a));
            const p1 = {x: c1.center.x + a * (c2.center.x - c1.center.x) / d, y: c1.center.y + a * (c2.center.y - c1.center.y) / d };
            const p2 = {x: p1.x + h * (c2.center.y - c1.center.y) / d, y: p1.y - h * (c2.center.x - c1.center.x) / d};
            return {
                inside: false,
                contains: false,
                points: [p1, p2]
            };
        }
    }

    export function circleRect(circle: Circle, rect: Rect): CollisionResult {
        const points = rectPoints(rect);
        const pts = points.reduce<Point[]>((acc, p, i) => {
            const next = i < points.length - 1 ? i + 1 : 0;
            const result = lineCircle({a: p, b: points[next]}, circle);
            return result ? acc.concat(result.points) : acc
        }, []);
        if (!pts.length) {
            if (points.some(p => pointCircle(p, circle))) {
                return {
                    inside: false,
                    contains: true,
                    points: pts
                }
            }
            else if (pointRect(circle.center, rect)) {
                return {
                    inside: true,
                    contains: false,
                    points: pts
                }
            }
            else {
                return null
            }
        }
        else return {
            inside: false,
            contains: false,
            points: pts
        }
    }

    export function circlePolygon(circle: Circle, polygon: Polygon): CollisionResult {
        const pts = polygon.reduce<Point[]>((acc, p, i) => {
            const next = i < polygon.length - 1 ? i + 1 : 0;
            const result = lineCircle({a: p, b: polygon[next]}, circle);
            return result ? acc.concat(result.points) : acc
        }, []);
        if (!pts.length) {
            if (polygon.some(p => pointCircle(p, circle))) {
                return {
                    inside: false,
                    contains: true,
                    points: pts
                }
            }
            else if (pointPolygon(circle.center, polygon)) {
                return {
                    inside: true,
                    contains: false,
                    points: pts
                }
            }
            else {
                return null
            }
        }
        else return {
            inside: false,
            contains: false,
            points: pts
        }
    }

    export function rectRect(a: Rect, b: Rect): CollisionResult {
        const ir = intersectRect(a, b);
        if (!ir) {
            return null;
        }
        else {
            const inside = containsRect(b, a);
            const contains = containsRect(a, b);
            if (inside || contains) {
                return {inside, contains, points: []}
            }
            else {
                const points = rectPoints(a);
                const pts = points.reduce<Point[]>((acc, p, i) => {
                    const next = i < points.length - 1 ? i + 1 : 0;
                    const result = lineRect({a: p, b: points[next]}, b);
                    return result ? acc.concat(result.points) : acc
                }, []);
                return pts.length ? {
                    inside: false,
                    contains: false,
                    points: pts
                } : null
            }
        }
    }

    export function rectPolygon(r: Rect, polygon: Polygon): CollisionResult {
        const pts = polygon.reduce<Point[]>((acc, p, i) => {
            const next = i < polygon.length - 1 ? i + 1 : 0;
            const result = lineRect({a: p, b: polygon[next]}, r);
            return result ? acc.concat(result.points) : acc
        }, []);
        if (!pts.length) {
            if (rectPoints(r).some(p => pointPolygon(p, polygon))) {
                return {
                    inside: true,
                    contains: false,
                    points: pts
                }
            }
            else if (polygon.some(p => pointRect(p, r))) {
                return {
                    inside: false,
                    contains: true,
                    points: pts
                }
            }
            else {
                return null
            }
        }
        else return {
            inside: false,
            contains: false,
            points: pts
        }
    }

    export function polygonPolygon(a: Polygon, b: Polygon): CollisionResult {
        const pts = a.reduce<Point[]>((acc, p, i) => {
            const next = i < a.length - 1 ? i + 1 : 0;
            const result = linePolygon({a: p, b: a[next]}, b);
            return result ? acc.concat(result.points) : acc
        }, []);
        if (!pts.length) {
            if (a.some(p => pointPolygon(p, b))) {
                return {
                    inside: true,
                    contains: false,
                    points: pts
                }
            }
            else if (b.some(p => pointPolygon(p, a))) {
                return {
                    inside: false,
                    contains: true,
                    points: pts
                }
            }
            else {
                return null
            }
        }
        else return {
            inside: false,
            contains: false,
            points: pts
        }
    }
}