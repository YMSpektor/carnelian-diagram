/** @jsxImportSource @carnelian/diagram */

import { DiagramElement, DiagramElementProps } from "@carnelian/diagram";
import { Collider, DrawingActionPayload, HandleControl, LineCollider, MovementActionPayload, PlacingPointActionPayload, useAction, useCollider, useControls } from "..";

export interface InteractiveLineProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export type LineColliderFactory<T extends InteractiveLineProps> = (props: T) => Collider<any>;

export function useInteractiveLine<T extends InteractiveLineProps>(
    props: DiagramElementProps<T>, 
    colliderFactory?: LineColliderFactory<T>
) {
    const { x1, y1, x2, y2, onChange } = props;

    function move(payload: MovementActionPayload) {
        onChange(props => ({
            ...props,
            x1: props.x1 + payload.deltaX,
            y1: props.y1 + payload.deltaY,
            x2: props.x2 + payload.deltaX,
            y2: props.y2 + payload.deltaY
        }));
    }

    function moveVertex(payload: MovementActionPayload) {
        onChange(props => ({
            ...props,
            x1: payload.hitArea.index === 0 ? payload.position.x : props.x1,
            y1: payload.hitArea.index === 0 ? payload.position.y : props.y1,
            x2: payload.hitArea.index === 1 ? payload.position.x : props.x2,
            y2: payload.hitArea.index === 1 ? payload.position.y : props.y2,
        }));
    }

    const collider = colliderFactory?.(props) || LineCollider({a: {x: x1, y: y1}, b: {x: x2, y: y2}});
    useCollider(collider, { type: "in", cursor: "move", action: "move" }, 0, 2);
    useAction<MovementActionPayload>("move", move);
    useAction<MovementActionPayload>("vertex_move", moveVertex);

    useAction<PlacingPointActionPayload>("draw_point:place", (payload) => {
        if (payload.pointIndex === 0) {
            onChange(props => ({
                ...props,
                x1: payload.position.x,
                y1: payload.position.y,
                x2: payload.position.x,
                y2: payload.position.y,
            }));
        }
        else {
            onChange(props => ({
                ...props,
                x2: payload.position.x,
                y2: payload.position.y,
            }));
        }
        payload.result.current = payload.pointIndex > 0;
    });

    useAction<DrawingActionPayload>("draw_point:move", (payload) => {
        onChange(props => ({
            ...props,
            x2: payload.position.x,
            y2: payload.position.y,
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
        const handles = [
            createHandleControl(0, x1, y1),
            createHandleControl(1, x2, y2)
        ];

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

export function withInteractiveLine<T extends InteractiveLineProps>(
    WrappedElement: DiagramElement<T>,
    colliderFactory?: LineColliderFactory<T>
): DiagramElement<T> {
    return (props) => {
        useInteractiveLine(props, colliderFactory);
        return <WrappedElement {...props} />;
    }
}