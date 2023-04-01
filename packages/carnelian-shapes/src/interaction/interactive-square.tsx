/** @jsxImportSource @carnelian/diagram */

import { DiagramElement, DiagramElementProps } from "@carnelian/diagram";
import { MovementActionPayload, useAction, useCollider } from "@carnelian/interaction";
import { Collider, RectCollider } from "@carnelian/interaction/collisions";
import { useInteractiveRectControls } from "./interactive-rect";

export interface InteractiveSquareProps {
    x: number;
    y: number;
    size: number;
}

export type SquareColliderFactory<T extends InteractiveSquareProps> = (props: T) => Collider<any>;

export function useInteractiveSquare<T extends InteractiveSquareProps>(
    props: DiagramElementProps<T>, 
    colliderFactory?: SquareColliderFactory<T>
) {
    const { x, y, size, onChange } = props;

    function move(payload: MovementActionPayload) {
        onChange(props => ({
            ...props,
            x: props.x + payload.deltaX,
            y: props.y + payload.deltaY
        }));
    }

    function resizeTopLeft(payload: MovementActionPayload) {
        onChange(props => {
            const d = Math.max(props.x - payload.position.x, props.y - payload.position.y);
            return {
                ...props,
                x: Math.min(props.x - d, props.x + props.size),
                y: Math.min(props.y - d, props.y + props.size),
                size: Math.max(0, props.size + d),
            }
        });
    }

    function resizeTopRight(payload: MovementActionPayload) {
        onChange(props => {
            const d = Math.max(payload.position.x - props.x - props.size, props.y - payload.position.y);
            return {
                ...props,
                y: Math.min(props.y - d, props.y + props.size),
                size: Math.max(0, props.size + d),
            }
        });
    }

    function resizeBottomLeft(payload: MovementActionPayload) {
        onChange(props => {
            const d = Math.max(props.x - payload.position.x, payload.position.y - props.y - props.size);
            return {
                ...props,
                x: Math.min(props.x - d, props.x + props.size),
                size: Math.max(0, props.size + d),
            }
        });
    }

    function resizeBottomRight(payload: MovementActionPayload) {
        onChange(props => {
            const d = Math.max(payload.position.x - props.x - props.size, payload.position.y - props.y - props.size);
            return {
                ...props,
                size: Math.max(0, props.size + d),
            }
        });
    }

    function resizeLeft(payload: MovementActionPayload) {
        onChange(props => ({
            ...props,
            x: Math.min(payload.position.x, props.x + props.size), 
            size: Math.max(0, props.x + props.size - payload.position.x),
        }));
    }

    function resizeTop(payload: MovementActionPayload) {
        onChange(props => ({
            ...props, 
            y: Math.min(payload.position.y, props.y + props.size), 
            size: Math.max(0, props.y + props.size - payload.position.y)
        }));
    }

    function resizeRight(payload: MovementActionPayload) {
        onChange(props => ({
            ...props,
            size: Math.max(0, payload.position.x - props.x),
        }));
    }

    function resizeBottom(payload: MovementActionPayload) {
        onChange(props => ({
            ...props,
            size: Math.max(0, payload.position.y - props.y)
        }));
    }

    const collider = colliderFactory?.(props) || RectCollider({x: props.x, y: props.y, width: props.size, height: props.size});
    useCollider(collider, { type: "in", action: "move", cursor: "move" });
    useAction<MovementActionPayload>("move", move);

    useInteractiveRectControls(
        x, y, size, size, resizeTopLeft, resizeTopRight, resizeBottomLeft, resizeBottomRight,
        resizeLeft, resizeTop, resizeRight, resizeBottom
    );    
}

export function withInteractiveSquare<T extends InteractiveSquareProps>(
    WrappedElement: DiagramElement<T>,
    colliderFactory?: SquareColliderFactory<T>
): DiagramElement<T> {
    return (props) => {
        useInteractiveSquare(props, colliderFactory);
        return <WrappedElement {...props} />;
    }
}