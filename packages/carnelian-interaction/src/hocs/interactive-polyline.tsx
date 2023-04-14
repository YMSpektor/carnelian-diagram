/** @jsxImportSource @carnelian/diagram */

import { DiagramElement, DiagramElementProps } from "@carnelian/diagram";
import { Collider, DrawingActionPayload, EmptyActionPayload, HandleControl, LineCollider, MovementActionPayload, PlacingPointActionPayload, UnionCollider, useAction, useCollider, useControls } from "..";
import { Line, Point } from "../geometry";

export interface InteractivePolylineProps {
    points: Point[];
}

export function PolylineCollider(points: Point[]) {
    const lines = points.reduce<Line[]>((acc, cur, i) => {
        return i > 0 ? acc.concat({ a: points[i - 1], b: cur }) : acc;
    }, []);
    return UnionCollider(...lines.map(LineCollider));
}

export type PolylineColliderFactory<T extends InteractivePolylineProps> = (props: T) => Collider<any>;

export function useInteractivePolyline<T extends InteractivePolylineProps>(
    props: DiagramElementProps<T>, 
    colliderFactory?: PolylineColliderFactory<T>
) {
    const { points, onChange } = props;

    function move(payload: MovementActionPayload) {
        onChange(props => ({
            ...props,
            points: points.map(p => ({ x: p.x + payload.deltaX, y: p.y + payload.deltaY }))
        }));
    }

    function moveVertex(payload: MovementActionPayload) {
        onChange(props => ({
            ...props,
            points: points.map((p, i) => i !== payload.hitArea.index ? p : { x: payload.position.x, y: payload.position.y })
        }));
    }

    const collider = colliderFactory?.(props) || PolylineCollider(points);
    useCollider(collider, { type: "in", cursor: "move", action: "move" }, 0, 2);
    useAction<MovementActionPayload>("move", move);
    useAction<MovementActionPayload>("vertex_move", moveVertex);

    useAction<PlacingPointActionPayload>("draw_point:place", (payload) => {
        onChange(props => ({
            ...props,
            points: props.points.concat({ x: payload.position.x, y: payload.position.y })
        }));
    });

    useAction<DrawingActionPayload>("draw_point:move", (payload) => {
        onChange(props => ({
            ...props,
            points: props.points.map((p, i) => i !== payload.pointIndex ? p : { x: payload.position.x, y: payload.position.y })
        }));
    });

    useAction<EmptyActionPayload>("draw_point:cancel", (payload) => {
        onChange(props => ({
            ...props,
            points: props.points.slice(0, props.points.length - 1)
        }));
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
                action: "vertex_move"
            }
        }
    }

    useControls((transform, element) => {
        const handles = points.map((p, i) => createHandleControl(i, p.x, p.y));

        return (
            <>
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
    colliderFactory?: PolylineColliderFactory<T>
): DiagramElement<T> {
    return (props) => {
        useInteractivePolyline(props, colliderFactory);
        return <WrappedElement {...props} />;
    }
}