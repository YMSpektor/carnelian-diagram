import { approximateEllipse, Circle, CollisionResult, Collisions, Ellipse, intersectRects, Point, Polygon, polygonBounds, Rect, rectPoints, unionRects } from "./geometry";

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

export function isRectCollider(collider: Collider<any>): collider is Collider<Rect> {
    return collider.type === "rect";
}

export function isPolygonCollider(collider: Collider<any>): collider is Collider<Polygon> {
    return collider.type === "polygon";
}

export function isCircleCollider(collider: Collider<any>): collider is Collider<Circle> {
    return collider.type === "circle";
}

export enum CombineOperation {
    OR, AND
}

export interface CombinedColliderProps {
    operation: CombineOperation;
    children: Collider<any>[];
}

export function CombinedCollider(operation: CombineOperation, children: Collider<any>[]): Collider<CombinedColliderProps> | Collider<null> {
    const bounds = operation === CombineOperation.AND 
        ? intersectRects(children.map(x => x.bounds))
        : unionRects(children.map(x => x.bounds));
    return bounds ? {
        type: (props: CombinedColliderProps, other: Collider<CombinedColliderProps>, tolerance: number) => {
            const results = props.children.map(child => collide(child, other, tolerance));
            switch (props.operation) {
                case CombineOperation.OR:
                    const hasResult = results.some(x => !!x);
                    const points = results.reduce<Point[]>((acc, cur) => cur ? acc.concat(cur.points) : acc, []);
                    return hasResult ? {
                        inside: results.every(x => x && x.inside),
                        contains: results.some(x => x && x.contains) || (!!points.length && points.every(p => {
                            const results = props.children.map(child => collide(PointCollider(p), child));
                            return results.some(x => x && x.inside);
                        })),
                        points: points
                    } : null;
            }
            return null;
        },
        props: {operation, children},
        bounds
    } : EmptyCollider();
}

export interface ApproxPolygonOptions {
    linesCount?: number;
    maxDeviation?: number;
}

export function ApproxPolygonCollider<T>(collider: Collider<T>, options?: ApproxPolygonOptions): Collider<Polygon> {
    let points: Polygon;
    if (isRectCollider(collider)) {
        points = rectPoints(collider.props);
    }
    else if (isCircleCollider(collider)) {
        const { center, radius } = collider.props;
        const props: Ellipse = { center, rx: radius, ry: radius };
        points = approximateEllipse(props, options?.linesCount || 12);
    }
    else if (isPolygonCollider(collider)) {
        return collider;
    }
    else {
        throw new Error(`Collider of type ${collider.type} can't be approximated as a polygon`);
    }

    return Collider("polygon", points, collider.bounds);
}

export function collide<A, B>(a: Collider<A>, b: Collider<B>, tolerance: number = 0): CollisionResult | null {
    if (typeof a.type === "function") {
        return a.type(a.props, b, tolerance);
    }
    else if (typeof b.type === "function") {
        return b.type(b.props, a, tolerance);
    }
    else {
        const algorythm = CollisionDetections.get(a.type, b.type);
        return algorythm?.(a.props, b.props, tolerance) || null;
    }
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
        map.set(key(t2, t1), (a, b, tolerance) => {
            const result = fn(b, a, tolerance);
            if (result) {
                const {inside, contains} = result;
                result.contains = inside;
                result.inside = contains;
            }
            return result;
        });
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