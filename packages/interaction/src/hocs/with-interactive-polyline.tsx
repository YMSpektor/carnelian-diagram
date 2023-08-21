/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement, DiagramElementProps } from "@carnelian-diagram/core";
import { ACT_DRAW_POINT_CANCEL, ACT_DRAW_POINT_CANCEL_Payload, ACT_DRAW_POINT_MOVE, ACT_DRAW_POINT_MOVE_Payload, ACT_DRAW_POINT_PLACE, ACT_DRAW_POINT_PLACE_Payload, ACT_MOVE, ClickActionPayload, Collider, DragActionPayload, EdgeControl, HandleControl, HitArea, LineCollider, PointCollider, UnionCollider, useAction, useCollider, useControls } from "..";
import { Line, Point } from "../geometry";

export interface InteractivePolylineProps {
    points: Point[];
}

export function PolylineCollider(points: Point[]) {
    if (points.length === 1) {
        return PointCollider(points[0]);
    }
    const lines = points.reduce<Line[]>((acc, cur, i) => {
        return i > 0 ? acc.concat({ a: points[i - 1], b: cur }) : acc;
    }, []);
    return UnionCollider(...lines.map(LineCollider));
}

export type PolylineColliderFactory<T extends InteractivePolylineProps> = (props: T) => Collider<any>;

export interface InteractivePolylineOptions<T extends InteractivePolylineProps> {
    collider?: PolylineColliderFactory<T>;
    innerHitArea?: (hitArea: HitArea) => HitArea;
}

export function useInteractivePolyline<T extends InteractivePolylineProps>(
    props: DiagramElementProps<T>,
    isClosed: boolean,
    minPoints: number,
    options?: InteractivePolylineOptions<T>
) {
    const { points, onChange } = props;

    function move(payload: DragActionPayload) {
        onChange(props => ({
            ...props,
            points: points.map(p => ({ x: p.x + payload.deltaX, y: p.y + payload.deltaY }))
        }));
    }

    function moveVertex(payload: DragActionPayload) {
        onChange(props => ({
            ...props,
            points: points.map((p, i) => i !== payload.hitArea.index ? p : { x: payload.position.x, y: payload.position.y })
        }));
    }

    const collider = options?.collider?.(props) || PolylineCollider(points);
    const tolerance = isClosed ? 0 : 2;
    let hitArea: HitArea = { type: "in", action: ACT_MOVE, cursor: "move" };
    if (options?.innerHitArea) {
        hitArea = options.innerHitArea(hitArea);
    }
    useCollider(collider, hitArea, tolerance);
    useAction(hitArea.action, move);
    useAction("vertex_move", moveVertex);

    useAction<ACT_DRAW_POINT_PLACE_Payload>(ACT_DRAW_POINT_PLACE, (payload) => {
        onChange(props => ({
            ...props,
            points: props.points.concat({ x: payload.position.x, y: payload.position.y })
        }));
    });

    useAction<ACT_DRAW_POINT_MOVE_Payload>(ACT_DRAW_POINT_MOVE, (payload) => {
        onChange(props => ({
            ...props,
            points: props.points.map((p, i) => i !== payload.pointIndex ? p : { x: payload.position.x, y: payload.position.y })
        }));
    });

    useAction<ACT_DRAW_POINT_CANCEL_Payload>(ACT_DRAW_POINT_CANCEL, (payload) => {
        if (payload.pointIndex < minPoints) {
            payload.result.current = false;
        }
        else {
            onChange(props => ({
                ...props,
                points: props.points.slice(0, props.points.length - 1)
            }));
        }
    });

    useAction<ClickActionPayload>("vertex_remove", (payload) => {
        if (typeof payload.hitArea.index === "number" && points.length > minPoints) {
            onChange(props => ({
                ...props,
                points: props.points.filter((x, i) => i !== payload.hitArea.index)
            }));
        }
    });

    useAction<ClickActionPayload>("vertex_insert", (payload) => {
        if (typeof payload.hitArea.index === "number") {
            const index = payload.hitArea.index;
            const newPoints = [...props.points];
            newPoints.splice(index + 1, 0, { x: payload.position.x, y: payload.position.y });
            onChange(props => ({
                ...props,
                points: newPoints
            }));
        }
    });

    function createHandleControl(
        index: number, 
        x: number, y: number, 
    ) {
        return {
            x, y,
            hitArea: {
                type: "vertex_handle",
                index,
                cursor: "move",
                action: "vertex_move",
                dblClickAction: "vertex_remove"
            }
        }
    }

    function createEdgeControl(
        index: number,
        x1: number, y1: number, x2: number, y2: number,
    ) {
        return {
            x1, y1, x2, y2,
            hitArea: {
                type: "edge",
                index,
                cursor: "move",
                action: ACT_MOVE,
                dblClickAction: "vertex_insert"
            },
        }
    }

    useControls((transform, element) => {
        const handles = points.map((p, i) => createHandleControl(i, p.x, p.y));
        const lines = points.reduce<Line[]>((acc, cur, i) => {
            return i < points.length - 1 
                ? acc.concat({ a: cur, b: points[i + 1] })
                : isClosed 
                    ? acc.concat({ a: cur, b: points[0] })
                    : acc;
        }, []);
        const edges = lines.map((l, i) => createEdgeControl(i, l.a.x, l.a.y, l.b.x, l.b.y));

        return (
            <>
                { edges.map(control => (
                    <EdgeControl
                        key={control.hitArea.index}
                        kind="default"
                        x1={control.x1} y1={control.y1} x2={control.x2} y2={control.y2}
                        hitArea={control.hitArea}
                        transform={transform}
                        element={element}
                    />
                ))}
                { handles.map(control => (
                    <HandleControl
                        key={control.hitArea.index}
                        kind="default"
                        x={control.x} y={control.y} hitArea={control.hitArea}
                        transform={transform} 
                        element={element}
                    />
                )) }
            </>
        )
    });
}

export function withInteractivePolyline<T extends InteractivePolylineProps>(
    WrappedElement: DiagramElement<T>,
    isClosed: boolean,
    minPoints: number,
    options?: InteractivePolylineOptions<T>
): DiagramElement<T> {
    return (props) => {
        useInteractivePolyline(props, isClosed, minPoints, options);
        return <WrappedElement {...props} />;
    }
}