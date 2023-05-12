import { Circle, circleBounds, containsRect, distance, distanceSquared, Ellipse, ellipseBounds, extendLine, intersectLines, intersectRect, Line, lineDistance, Point, pointInCircle, pointInEllipse, pointInHalfplane, pointInPolygon, pointInRect, pointOnCircle, pointOnEllipse, pointOnPolygon, pointOnRect, Polygon, polygonBounds, Rect, rectPoints, segmentDistance, sqr } from "../geometry";
import { Shapes, Intersection, Point2D } from "kld-intersections";

export type CollisionResult = null | {
    inside: boolean;
    contains: boolean;
    points: Point[];
}

export function flipCollisionResult(result: CollisionResult): CollisionResult {
    if (result) {
        const { inside, contains, points } = result;
        result = { inside: contains, contains: inside, points };
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
    else return { ...result }
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
        const result = pointInCircle(p, circle);
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

    export function pointEllipse(p: Point, e: Ellipse): CollisionResult {
        const result = pointInEllipse(p, e);
        if (result) {
            const inside = !pointOnEllipse(p, e, 0.01);
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
        if (!polygon.length) return null;
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

    export function pointHalfplane(p: Point, hs: Line): CollisionResult {
        const result = pointInHalfplane(p, hs.a, hs.b);
        if (result) {
            const inside = lineDistance(p, hs.a, hs.b) > 0.01
            return {
                inside,
                contains: false,
                points: inside ? [] : [p]
            }
        }
        return null;
    }

    export function lineLine(l1: Line, l2: Line): CollisionResult {
        const { a: a1, b: b1 } = l1;
        const { a: a2, b: b2 } = l2;
        const shape1 = Shapes.line(new Point2D(a1.x, a1.y), new Point2D(b1.x, b1.y));
        const shape2 = Shapes.line(new Point2D(a2.x, a2.y), new Point2D(b2.x, b2.y));
        const pts = Intersection.intersect(shape1, shape2).points;
        return pts.length ? {
            inside: false,
            contains: false,
            points: pts.map(p => ({x: p.x, y: p.y}))
        } : null
    }

    export function lineRect(line: Line, rect: Rect): CollisionResult {
        const points = rectPoints(rect);
        const pts = points.reduce<Point[]>((acc, p, i) => {
            const next = i < points.length - 1 ? i + 1 : 0;
            const result = lineLine({ a: p, b: points[next] }, line);
            return result ? acc.concat(result.points) : acc
        }, []);
        if (pts.length) {
            return {
                inside: false,
                contains: false,
                points: pts
            }
        }
        else {
            return pointInRect(line.a, rect) && pointInRect(line.b, rect) ? ({
                inside: true,
                contains: false,
                points: []
            }) : null
        }
    }

    export function lineCircle(line: Line, circle: Circle): CollisionResult {
        const { a, b } = line;
        const shape1 = Shapes.line(new Point2D(a.x, a.y), new Point2D(b.x, b.y));
        const shape2 = Shapes.circle(new Point2D(circle.center.x, circle.center.y), circle.radius);
        const pts = Intersection.intersect(shape1, shape2).points;
        if (pts.length) {
            return {
                inside: false,
                contains: false,
                points: pts.map(p => ({x: p.x, y: p.y}))
            }
        }
        else {
            return pointInCircle(a, circle) && pointInCircle(b, circle) ? ({
                inside: true,
                contains: false,
                points: []
            }) : null
        }
    }

    export function lineEllipse(line: Line, e: Ellipse): CollisionResult {
        if (e.ry === 0) {
            return lineLine(line, {a: {x: e.center.x - e.rx, y: e.center.y}, b: {x: e.center.x + e.rx, y: e.center.y}})
        }
        if (e.rx === 0) {
            return lineLine(line, {a: {y: e.center.y - e.ry, x: e.center.x}, b: {y: e.center.y + e.ry, x: e.center.x}})
        }
        const { a, b } = line;
        const shape1 = Shapes.line(new Point2D(a.x, a.y), new Point2D(b.x, b.y));
        const shape2 = Shapes.ellipse(new Point2D(e.center.x, e.center.y), e.rx, e.ry);
        const pts = Intersection.intersect(shape1, shape2).points;
        if (pts.length) {
            return {
                inside: false,
                contains: false,
                points: pts.map(p => ({x: p.x, y: p.y}))
            }
        }
        else {
            return pointInEllipse(a, e) && pointInEllipse(b, e) ? ({
                inside: true,
                contains: false,
                points: []
            }) : null
        }
    }

    export function linePolygon(line: Line, polygon: Polygon): CollisionResult {
        if (!polygon.length) return null;
        const pts = polygon.reduce<Point[]>((acc, p, i) => {
            const next = i < polygon.length - 1 ? i + 1 : 0;
            const result = lineLine(line, { a: p, b: polygon[next] });
            return result ? acc.concat(result.points) : acc
        }, []);

        if (pts.length) {
            return {
                inside: false,
                contains: false,
                points: pts
            }
        }
        else {
            return pointInPolygon(line.a, polygon) && pointInPolygon(line.b, polygon) ? ({
                inside: true,
                contains: false,
                points: []
            }) : null
        }
    }

    export function lineHalfplane(line: Line, hs: Line): CollisionResult {
        const p = intersectLines(line, hs, false, true);
        if (p) {
            return {
                inside: false,
                contains: false,
                points: [p]
            }
        }
        else {
            return pointInHalfplane(line.a, hs.a, hs.b) && pointInHalfplane(line.b, hs.a, hs.b) ? ({
                inside: true,
                contains: false,
                points: []
            }) : null
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
            return { inside, contains, points: [] }
        }
        else {
            const shape1 = Shapes.circle(new Point2D(c1.center.x, c1.center.y), c1.radius);
            const shape2 = Shapes.circle(new Point2D(c2.center.x, c2.center.y), c2.radius);
            const pts = Intersection.intersect(shape1, shape2).points;
            return pts.length ? {
                inside: false,
                contains: false,
                points: pts.map(p => ({x: p.x, y: p.y}))
            } : null;
        }
    }

    export function circleEllipse(c: Circle, e: Ellipse): CollisionResult {
        const shape1 = Shapes.circle(new Point2D(c.center.x, c.center.y), c.radius);
        const shape2 = Shapes.ellipse(new Point2D(e.center.x, e.center.y), e.rx, e.ry);
        const pts = Intersection.intersect(shape1, shape2).points;
        if (pts.length) {
            return {
                inside: false,
                contains: false,
                points: pts.map(p => ({x: p.x, y: p.y}))
            }
        }
        else {
            const PinE = pointInEllipse(c.center, e);
            const PinC = pointInCircle(e.center, c);
            if (PinE || PinC) {
                return {
                    inside: pointInEllipse({x: c.center.x + c.radius, y: c.center.y}, e),
                    contains: pointInCircle({x: e.center.x + e.rx, y: e.center.y}, c),
                    points: []
                }
            }
            else {
                return null;
            }
        }
    }

    export function circleRect(circle: Circle, rect: Rect): CollisionResult {
        const points = rectPoints(rect);
        const pts = points.reduce<Point[]>((acc, p, i) => {
            const next = i < points.length - 1 ? i + 1 : 0;
            const result = lineCircle({ a: p, b: points[next] }, circle);
            return result ? acc.concat(result.points) : acc
        }, []);
        if (!pts.length) {
            if (pointInCircle(points[0], circle)) {
                return {
                    inside: false,
                    contains: true,
                    points: pts
                }
            }
            else if (pointInRect(circle.center, rect)) {
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
        if (!polygon.length) return null;
        const pts = polygon.reduce<Point[]>((acc, p, i) => {
            const next = i < polygon.length - 1 ? i + 1 : 0;
            const result = lineCircle({ a: p, b: polygon[next] }, circle);
            return result ? acc.concat(result.points) : acc
        }, []);
        if (!pts.length) {
            if (pointInCircle(polygon[0], circle)) {
                return {
                    inside: false,
                    contains: true,
                    points: pts
                }
            }
            else if (pointInPolygon(circle.center, polygon)) {
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

    export function circleHalfplane(circle: Circle, hs: Line): CollisionResult {
        const line = extendLine(hs, circleBounds(circle));
        const result = lineCircle(line, circle);
        if (result) {
            return {
                inside: false,
                contains: false,
                points: result.points
            }
        }
        else {
            return pointInHalfplane(circle.center, hs.a, hs.b) ? ({
                inside: true,
                contains: false,
                points: []
            }) : null
        }
    }

    export function ellipseEllipse(a: Ellipse, b: Ellipse): CollisionResult {
        const shape1 = Shapes.ellipse(new Point2D(a.center.x, a.center.y), a.rx, a.ry);
        const shape2 = Shapes.ellipse(new Point2D(b.center.x, b.center.y), b.rx, b.ry);
        const pts = Intersection.intersect(shape1, shape2).points;
        if (pts.length) {
            return {
                inside: false,
                contains: false,
                points: pts.map(p => ({x: p.x, y: p.y}))
            }
        }
        else {
            const PinA = pointInEllipse(a.center, b);
            const PinB = pointInEllipse(b.center, a);
            if (PinA || PinB) {
                return {
                    inside: pointInEllipse({x: a.center.x + a.rx, y: a.center.y}, b),
                    contains: pointInEllipse({x: b.center.x + b.rx, y: b.center.y}, a),
                    points: []
                }
            }
            else {
                return null;
            }
        }
    }export function ellipseRect(e: Ellipse, rect: Rect): CollisionResult {
        const points = rectPoints(rect);
        const pts = points.reduce<Point[]>((acc, p, i) => {
            const next = i < points.length - 1 ? i + 1 : 0;
            const result = lineEllipse({ a: p, b: points[next] }, e);
            return result ? acc.concat(result.points) : acc
        }, []);
        if (!pts.length) {
            if (pointInEllipse(points[0], e)) {
                return {
                    inside: false,
                    contains: true,
                    points: pts
                }
            }
            else if (pointInRect(e.center, rect)) {
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

    export function ellipsePolygon(e: Ellipse, polygon: Polygon): CollisionResult {
        if (!polygon.length) return null;
        const pts = polygon.reduce<Point[]>((acc, p, i) => {
            const next = i < polygon.length - 1 ? i + 1 : 0;
            const result = lineEllipse({ a: p, b: polygon[next] }, e);
            return result ? acc.concat(result.points) : acc
        }, []);
        if (!pts.length) {
            if (pointInEllipse(polygon[0], e)) {
                return {
                    inside: false,
                    contains: true,
                    points: pts
                }
            }
            else if (pointInPolygon(e.center, polygon)) {
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

    export function ellipseHalfplane(e: Ellipse, hs: Line): CollisionResult {
        const line = extendLine(hs, ellipseBounds(e));
        const result = lineEllipse(line, e);
        if (result) {
            return {
                inside: false,
                contains: false,
                points: result.points
            }
        }
        else {
            return pointInHalfplane(e.center, hs.a, hs.b) ? ({
                inside: true,
                contains: false,
                points: []
            }) : null
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
                return { inside, contains, points: [] }
            }
            else {
                const points = rectPoints(a);
                const pts = points.reduce<Point[]>((acc, p, i) => {
                    const next = i < points.length - 1 ? i + 1 : 0;
                    const result = lineRect({ a: p, b: points[next] }, b);
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
        if (!polygon.length) return null;
        const pts = polygon.reduce<Point[]>((acc, p, i) => {
            const next = i < polygon.length - 1 ? i + 1 : 0;
            const result = lineRect({ a: p, b: polygon[next] }, r);
            return result ? acc.concat(result.points) : acc
        }, []);
        if (!pts.length) {
            if (pointInPolygon(rectPoints(r)[0], polygon)) {
                return {
                    inside: true,
                    contains: false,
                    points: pts
                }
            }
            else if (polygon.some(p => pointInRect(p, r))) {
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

    export function rectHalfplane(r: Rect, hs: Line): CollisionResult {
        const line = extendLine(hs, r);
        const result = lineRect(line, r);
        if (result) {
            return {
                inside: false,
                contains: false,
                points: result.points
            }
        }
        else {
            return pointInHalfplane({x: r.x, y: r.y}, hs.a, hs.b) ? ({
                inside: true,
                contains: false,
                points: []
            }) : null
        }
    }

    export function polygonPolygon(a: Polygon, b: Polygon): CollisionResult {
        if (!a.length) return null;
        const pts = a.reduce<Point[]>((acc, p, i) => {
            const next = i < a.length - 1 ? i + 1 : 0;
            const result = linePolygon({ a: p, b: a[next] }, b);
            return result ? acc.concat(result.points) : acc
        }, []);
        if (!pts.length) {
            if (pointInPolygon(a[0], b)) {
                return {
                    inside: true,
                    contains: false,
                    points: pts
                }
            }
            else if (pointInPolygon(b[0], a)) {
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

    export function polygonHalfplane(polygon: Polygon, hs: Line): CollisionResult {
        if (!polygon.length) return null;
        const line = extendLine(hs, polygonBounds(polygon)!);
        const result = linePolygon(line, polygon);
        if (result) {
            return {
                inside: false,
                contains: false,
                points: result.points
            }
        }
        else {
            return pointInHalfplane(polygon[0], hs.a, hs.b) ? ({
                inside: true,
                contains: false,
                points: []
            }) : null
        }
    }

    export function halfplaneHalfplane(a: Line, b: Line): CollisionResult {
        const p = intersectLines(a, b, true, true);
        if (p) {
            return {
                inside: false,
                contains: false,
                points: [p]
            }
        }
        else {
            const AinB = pointInHalfplane(a.a, b.a, b.b);
            const BinA = pointInHalfplane(b.a, a.a, a.b);
            return AinB || BinA ? {
                inside: AinB && !BinA,
                contains: BinA && !AinB,
                points: []
            } : null;
        }
    }
}