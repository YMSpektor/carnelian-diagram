import { approximateEllipse, Circle, CollisionResult, Collisions, Ellipse, flipCollisionResult, intersectRects, invertCollisionResult, Line, Point, Polygon, polygonBounds, Rect, rectPoints, unionRects } from "./geometry";

export type ColliderType<T> = string | ((props: T, other: Collider<any>, tolerance: number) => CollisionResult | null);

export interface Collider<T> {
    type: ColliderType<T>;
    props: T;
    bounds: Rect;
}

export function Collider<T>(type: ColliderType<T>, props: T, bounds: Rect): Collider<T> {
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

export function CircleCollider(circle: Circle): Collider<Circle> {
    return Collider("circle", circle, {
        x: circle.center.x - circle.radius,
        y: circle.center.y - circle.radius,
        width: circle.radius * 2,
        height: circle.radius * 2
    });
}

export function RectCollider(rect: Rect): Collider<Rect> {
    return Collider("rect", rect, rect);
}

export function PolygonCollider(polygon: Polygon): Collider<Polygon> {
    return Collider("polygon", polygon, polygonBounds(polygon) || {x: 0, y: 0, width: 0, height: 0});
}

export function EmptyCollider(): Collider<null> {
    return Collider(() => null, null, {x: 0, y: 0, width: 0, height: 0});
}

export function UnionCollider(children: Collider<any>[]): Collider<null> {
    const bounds = unionRects(children.map(x => x.bounds));
    return bounds ? {
        type: (_, other, tolerance) => {
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
        props: null,
        bounds
    } : EmptyCollider()
}

export function IntersectionCollider(children: Collider<any>[]): Collider<null> {
    const bounds = intersectRects(children.map(x => x.bounds));
    return bounds ? {
        type: (_, other, tolerance) => {
            const results = children.map(child => collide(child, other, tolerance));
            const points = results.reduce<Point[]>((acc, cur) => cur ? acc.concat(cur.points) : acc, []);
            return results.every(x => !!x) ? {
                inside: results.some(x => x?.inside) || (!!points.length && points.every(p => {
                    const results = children.map(child => collide(PointCollider(p), child));
                    return results.every(x => x && !x.inside);
                })),
                contains: results.every(x => x?.contains),
                points
            } : null;
        },
        props: null,
        bounds
    } : EmptyCollider()
}

// Fixme: Make inverse operation involutory: A == !!A
export function InverseCollider(child: Collider<any>): Collider<null> {
    return {
        type: (_, other, tolerance) => invertCollisionResult(collide(child, other, tolerance)),
        props: null,
        bounds: {
            x: -Number.MAX_VALUE,
            y: -Number.MAX_VALUE,
            width: Number.POSITIVE_INFINITY,
            height: Number.POSITIVE_INFINITY
        }
    }
}

export function DiffCollider(a: Collider<any>, b: Collider<any>): Collider<null> {
    console.log(11);
    return IntersectionCollider([a, InverseCollider(b)]);
}

export function isPointCollider(collider: Collider<any>): collider is Collider<Point> {
    return collider.type === "point";
}

export function isRectLineCollider(collider: Collider<any>): collider is Collider<Line> {
    return collider.type === "line";
}

export function isRectCollider(collider: Collider<any>): collider is Collider<Rect> {
    return collider.type === "rect";
}

export function isCircleCollider(collider: Collider<any>): collider is Collider<Circle> {
    return collider.type === "circle";
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

CollisionDetections.register("point", "point", Collisions.pointPoint);
CollisionDetections.register("point", "line", Collisions.pointLine);
CollisionDetections.register("point", "circle", Collisions.pointCircle);
CollisionDetections.register("point", "rect", Collisions.pointRect);
CollisionDetections.register("point", "polygon", Collisions.pointPolygon);
CollisionDetections.register("line", "line", Collisions.lineLine);
CollisionDetections.register("line", "circle", Collisions.lineCircle);
CollisionDetections.register("line", "rect", Collisions.lineRect);
CollisionDetections.register("line", "polygon", Collisions.linePolygon);
CollisionDetections.register("circle", "circle", Collisions.circleCircle);
CollisionDetections.register("circle", "rect", Collisions.circleRect);
CollisionDetections.register("circle", "polygon", Collisions.circlePolygon);
CollisionDetections.register("rect", "rect", Collisions.rectRect);
CollisionDetections.register("rect", "polygon", Collisions.rectPolygon);
CollisionDetections.register("polygon", "polygon", Collisions.polygonPolygon);