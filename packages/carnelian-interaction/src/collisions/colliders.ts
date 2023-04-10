import { Circle, circleBounds, Ellipse, ellipseBounds, intersectRects, Line, lineBounds, Point, Polygon, polygonBounds, Rect, unionRects } from "../geometry";
import { CollisionResult, flipCollisionResult, invertCollisionResult, CollisionFunctions } from "./collisions";

export type ColliderType<T> = string | ((props: T, other: Collider<any>, tolerance: number) => CollisionResult | null);

export interface Collider<T> {
    type: ColliderType<T>;
    props: T;
    bounds: Rect | null;
}

export function Collider<T>(type: ColliderType<T>, props: T, bounds: Rect | null): Collider<T> {
    return {
        type,
        props,
        bounds
    }
}

export function collide<A, B>(a: Collider<A>, b: Collider<B>, tolerance: number = 0): CollisionResult | null {
    if (typeof a.type === "function") {
        return a.type(a.props, b, tolerance);
    }
    else if (typeof b.type === "function") {
        return flipCollisionResult(b.type(b.props, a, tolerance));
    }
    else {
        const algorythm = CollisionDetections.get(a.type, b.type);
        return algorythm?.(a.props, b.props, tolerance) || null;
    }
}

export function PointCollider(point: Point): Collider<Point> {
    return Collider("point", point, {...point, width: 0, height: 0});
}

export function LineCollider(line: Line): Collider<Line> {
    return Collider("line", line, lineBounds(line));
}

export function RectCollider(rect: Rect): Collider<Rect> {
    return Collider("rect", rect, rect);
}

export function CircleCollider(circle: Circle): Collider<Circle> {
    return Collider("circle", circle, circleBounds(circle));
}

export function EllipseCollider(ellipse: Ellipse): Collider<Ellipse> {
    return Collider("ellipse", ellipse, ellipseBounds(ellipse));
}

export function PolygonCollider(polygon: Polygon): Collider<Polygon> {
    return Collider("polygon", polygon, polygonBounds(polygon) || {x: 0, y: 0, width: 0, height: 0});
}

export function HalfPlaneCollider(hs: Line): Collider<Line> {
    return Collider("halfplane", hs, null);
}

export function EmptyCollider(): Collider<null> {
    return Collider(() => null, null, {x: 0, y: 0, width: 0, height: 0});
}

export function UnionCollider(...children: Collider<any>[]): Collider<Collider<any>[]> {
    const childrenBounds = children.map(x => x.bounds);
    const bounds = childrenBounds.some(x => !x) ? null : unionRects(childrenBounds as Rect[]);
    return {
        type: (children, other, tolerance) => {
            const results = children.map(child => collide(child, other, tolerance));
            const points = results.reduce<Point[]>((acc, cur) => cur ? acc.concat(cur.points) : acc, []);
            return results.some(x => !!x) ? {
                inside: results.every(x => x?.inside),
                contains: results.some(x => x?.contains) || (!!points.length && points.every(p => {
                    const results = children.map(child => collide(PointCollider(p), child));
                    return results.some(x => x && x.inside);
                })),
                points: points
            } : null;
        },
        props: children,
        bounds
    }
}

export function IntersectionCollider(...children: Collider<any>[]): Collider<Collider<any>[]> {
    const bounds = intersectRects(children.filter(x => x.bounds).map(x => x.bounds!));
    return {
        type: (children, other, tolerance) => {
            const results = children.map(child => collide(child, other, tolerance));
            if (results.some(x => !x)) {
                return null;
            }
            // Filter only the points inside one of the children
            const points = results
                .reduce<Point[]>((acc, cur) => cur ? acc.concat(cur.points) : acc, [])
                .filter(p => {
                    const results = children.map(child => collide(PointCollider(p), child));
                    return results.some(x => x && x.inside);
                });
            if (points.length) {
                return {
                    inside: false,
                    contains: false,
                    points
                }
            }
            else {
                const inside = results.some(x => x?.inside);
                const contains = results.every(x => x?.contains);
                return inside || contains ? {
                    inside,
                    contains,
                    points
                } : null
            }
        },
        props: children,
        bounds
    }
}

// Fixme: Make inverse operation involutory: A == !!A
export function InverseCollider(child: Collider<any>): Collider<Collider<any>> {
    return {
        type: (child, other, tolerance) => invertCollisionResult(collide(child, other, tolerance)),
        props: child,
        bounds: null
    }
}

export function DiffCollider(a: Collider<any>, b: Collider<any>) {
    return IntersectionCollider(a, InverseCollider(b));
}

export function isPointCollider(collider: Collider<any>): collider is Collider<Point> {
    return collider.type === "point";
}

export function isLineCollider(collider: Collider<any>): collider is Collider<Line> {
    return collider.type === "line";
}

export function isRectCollider(collider: Collider<any>): collider is Collider<Rect> {
    return collider.type === "rect";
}

export function isCircleCollider(collider: Collider<any>): collider is Collider<Circle> {
    return collider.type === "circle";
}

export function isEllipseCollider(collider: Collider<any>): collider is Collider<Ellipse> {
    return collider.type === "ellipse";
}

export function isPolygonCollider(collider: Collider<any>): collider is Collider<Polygon> {
    return collider.type === "polygon";
}

export type CollisionDetectionFunction<A, B> = (a: A, b: B, tolerance: number) => CollisionResult | null;

export namespace CollisionDetections {
    const map = new Map<string, CollisionDetectionFunction<any, any>>();

    function key(t1: string, t2: string): string {
        return `${t1}|${t2}`;
    }

    export function get(t1: string, t2: string) {
        return map.get(key(t1, t2));
    }

    export function register<A, B>(t1: string, t2: string, fn: CollisionDetectionFunction<A, B>) {
        map.set(key(t1, t2), fn);
        map.set(key(t2, t1), (a, b, tolerance) => flipCollisionResult(fn(b, a, tolerance)));
    }
}

CollisionDetections.register("point", "point", CollisionFunctions.pointPoint);
CollisionDetections.register("point", "line", CollisionFunctions.pointLine);
CollisionDetections.register("point", "circle", CollisionFunctions.pointCircle);
CollisionDetections.register("point", "ellipse", CollisionFunctions.pointEllipse);
CollisionDetections.register("point", "rect", CollisionFunctions.pointRect);
CollisionDetections.register("point", "polygon", CollisionFunctions.pointPolygon);
CollisionDetections.register("point", "halfplane", CollisionFunctions.pointHalfplane);

CollisionDetections.register("line", "line", CollisionFunctions.lineLine);
CollisionDetections.register("line", "circle", CollisionFunctions.lineCircle);
CollisionDetections.register("line", "ellipse", CollisionFunctions.lineEllipse);
CollisionDetections.register("line", "rect", CollisionFunctions.lineRect);
CollisionDetections.register("line", "polygon", CollisionFunctions.linePolygon);
CollisionDetections.register("line", "halfplane", CollisionFunctions.lineHalfplane);

CollisionDetections.register("circle", "circle", CollisionFunctions.circleCircle);
CollisionDetections.register("circle", "ellipse", CollisionFunctions.circleEllipse);
CollisionDetections.register("circle", "rect", CollisionFunctions.circleRect);
CollisionDetections.register("circle", "polygon", CollisionFunctions.circlePolygon);
CollisionDetections.register("circle", "halfplane", CollisionFunctions.circleHalfplane);

CollisionDetections.register("ellipse", "ellipse", CollisionFunctions.ellipseEllipse);
CollisionDetections.register("ellipse", "rect", CollisionFunctions.ellipseRect);
CollisionDetections.register("ellipse", "polygon", CollisionFunctions.ellipsePolygon);
CollisionDetections.register("ellipse", "halfplane", CollisionFunctions.ellipseHalfplane);

CollisionDetections.register("rect", "rect", CollisionFunctions.rectRect);
CollisionDetections.register("rect", "polygon", CollisionFunctions.rectPolygon);
CollisionDetections.register("rect", "halfplane", CollisionFunctions.rectHalfplane);

CollisionDetections.register("polygon", "polygon", CollisionFunctions.polygonPolygon);
CollisionDetections.register("polygon", "halfplane", CollisionFunctions.polygonHalfplane);

CollisionDetections.register("halfplane", "halfplane", CollisionFunctions.halfplaneHalfplane);