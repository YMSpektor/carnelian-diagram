import { Circle, containsRect, distance, distanceSquared, Ellipse, intersectRect, Line, Point, pointInCircle, pointInEllipse, pointInPolygon, pointInRect, pointOnCircle, pointOnEllipse, pointOnPolygon, pointOnRect, Polygon, Rect, rectPoints, segmentDistance, sqr } from "../geometry";
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
                const result = lineLine({ a: p, b: points[next] }, line);
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
            const shape1 = Shapes.line(new Point2D(a.x, a.y), new Point2D(b.x, b.y));
            const shape2 = Shapes.circle(new Point2D(circle.center.x, circle.center.y), circle.radius);
            const pts = Intersection.intersect(shape1, shape2).points;
            return pts.length ? {
                inside: false,
                contains: false,
                points: pts.map(p => ({x: p.x, y: p.y}))
            } : null
        }
    }

    export function lineEllipse(line: Line, e: Ellipse): CollisionResult {
        if (e.ry === 0) {
            return lineLine(line, {a: {x: e.center.x - e.rx, y: e.center.y}, b: {x: e.center.x + e.rx, y: e.center.y}})
        }
        if (e.rx === 0) {
            return lineLine(line, {a: {y: e.center.y - e.ry, x: e.center.x}, b: {y: e.center.y + e.ry, x: e.center.x}})
        }
        if (pointEllipse(line.a, e) && pointEllipse(line.b, e)) {
            return {
                inside: true,
                contains: false,
                points: []
            }
        }
        else {
            const { a, b } = line;
            const shape1 = Shapes.line(new Point2D(a.x, a.y), new Point2D(b.x, b.y));
            const shape2 = Shapes.ellipse(new Point2D(e.center.x, e.center.y), e.rx, e.ry);
            const pts = Intersection.intersect(shape1, shape2).points;
            return pts.length ? {
                inside: false,
                contains: false,
                points: pts.map(p => ({x: p.x, y: p.y}))
            } : null
        }
    }

    export function linePolygon(line: Line, polygon: Polygon): CollisionResult {
        const pts = polygon.reduce<Point[]>((acc, p, i) => {
            const next = i < polygon.length - 1 ? i + 1 : 0;
            const result = lineLine(line, { a: p, b: polygon[next] });
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
            const result = lineCircle({ a: p, b: polygon[next] }, circle);
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
            if (points.some(p => pointEllipse(p, e))) {
                return {
                    inside: false,
                    contains: true,
                    points: pts
                }
            }
            else if (pointRect(e.center, rect)) {
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
        const pts = polygon.reduce<Point[]>((acc, p, i) => {
            const next = i < polygon.length - 1 ? i + 1 : 0;
            const result = lineEllipse({ a: p, b: polygon[next] }, e);
            return result ? acc.concat(result.points) : acc
        }, []);
        if (!pts.length) {
            if (polygon.some(p => pointEllipse(p, e))) {
                return {
                    inside: false,
                    contains: true,
                    points: pts
                }
            }
            else if (pointPolygon(e.center, polygon)) {
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
        const pts = polygon.reduce<Point[]>((acc, p, i) => {
            const next = i < polygon.length - 1 ? i + 1 : 0;
            const result = lineRect({ a: p, b: polygon[next] }, r);
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
            const result = linePolygon({ a: p, b: a[next] }, b);
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