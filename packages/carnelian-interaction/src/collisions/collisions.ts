import { Point, distanceSquared, sqr, Line, segmentDistance, Circle, pointOnCircle, Rect, pointInRect, pointOnRect, Polygon, pointInPolygon, pointOnPolygon, rectPoints, distance, intersectRect, containsRect } from "../geometry";

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

export namespace CollisionFunctions {
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
        const result = pointInRect(p, r);
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
        let result = pointInPolygon(p, polygon);
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