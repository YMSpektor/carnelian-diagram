/** @jsxImportSource @carnelian/diagram */

import { DiagramElement, DiagramElementProps } from "@carnelian/diagram";
import { ACT_MOVE, DraggingActionPayload, useAction, useCollider } from "..";
import { Collider, RectCollider } from "../collisions";
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

    function move(payload: DraggingActionPayload) {
        onChange(props => ({
            ...props,
            x: props.x + payload.deltaX,
            y: props.y + payload.deltaY
        }));
    }

    function resizeTopLeft(payload: DraggingActionPayload) {
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

    function resizeTopRight(payload: DraggingActionPayload) {
        onChange(props => {
            const d = Math.max(payload.position.x - props.x - props.size, props.y - payload.position.y);
            return {
                ...props,
                y: Math.min(props.y - d, props.y + props.size),
                size: Math.max(0, props.size + d),
            }
        });
    }

    function resizeBottomLeft(payload: DraggingActionPayload) {
        onChange(props => {
            const d = Math.max(props.x - payload.position.x, payload.position.y - props.y - props.size);
            return {
                ...props,
                x: Math.min(props.x - d, props.x + props.size),
                size: Math.max(0, props.size + d),
            }
        });
    }

    function resizeBottomRight(payload: DraggingActionPayload) {
        onChange(props => {
            const d = Math.max(payload.position.x - props.x - props.size, payload.position.y - props.y - props.size);
            return {
                ...props,
                size: Math.max(0, props.size + d),
            }
        });
    }

    function resizeLeft(payload: DraggingActionPayload) {
        onChange(props => ({
            ...props,
            x: Math.min(payload.position.x, props.x + props.size), 
            size: Math.max(0, props.x + props.size - payload.position.x),
        }));
    }

    function resizeTop(payload: DraggingActionPayload) {
        onChange(props => ({
            ...props, 
            y: Math.min(payload.position.y, props.y + props.size), 
            size: Math.max(0, props.y + props.size - payload.position.y)
        }));
    }

    function resizeRight(payload: DraggingActionPayload) {
        onChange(props => ({
            ...props,
            size: Math.max(0, payload.position.x - props.x),
        }));
    }

    function resizeBottom(payload: DraggingActionPayload) {
        onChange(props => ({
            ...props,
            size: Math.max(0, payload.position.y - props.y)
        }));
    }

    function defaultCollider() {
        const result = RectCollider({x: props.x, y: props.y, width: props.size, height: props.size});
        result.bounds = null; // No need to perform broad phase testing for rect colliders
        return result;
    }

    const collider = colliderFactory?.(props) || defaultCollider();
    useCollider(collider, { type: "in", action: ACT_MOVE, cursor: "move" });
    useAction(ACT_MOVE, move);

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