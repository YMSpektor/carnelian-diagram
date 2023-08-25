/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement, DiagramElementProps } from "@carnelian-diagram/core";
import { ACT_DRAW_POINT_CANCEL, ACT_DRAW_POINT_CANCEL_Payload, ACT_DRAW_POINT_MOVE, ACT_DRAW_POINT_MOVE_Payload, ACT_DRAW_POINT_PLACE, ACT_DRAW_POINT_PLACE_Payload, ACT_MOVE, ACT_PASTE, ACT_PASTE_Payload, DragActionPayload, HitArea, useAction, useCollider } from "..";
import { Collider, RectCollider } from "../collisions";
import { useInteractiveRectControls } from "./with-interactive-rect";

export interface InteractiveSquareProps {
    x: number;
    y: number;
    size: number;
}

export type SquareColliderFactory<T extends InteractiveSquareProps> = (props: T) => Collider<any>;

export interface InteractiveSquareOptions<T extends InteractiveSquareProps> {
    collider?: SquareColliderFactory<T>;
    innerHitArea?: (hitArea: HitArea) => HitArea;
}

export function useInteractiveSquare<T extends InteractiveSquareProps>(
    props: DiagramElementProps<T>, 
    options?: InteractiveSquareOptions<T>
) {
    const { x, y, size, onChange } = props;

    function move(payload: DragActionPayload) {
        onChange(props => ({
            ...props,
            x: props.x + payload.deltaX,
            y: props.y + payload.deltaY
        }));
    }

    function resizeTopLeft(payload: DragActionPayload) {
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

    function resizeTopRight(payload: DragActionPayload) {
        onChange(props => {
            const d = Math.max(payload.position.x - props.x - props.size, props.y - payload.position.y);
            return {
                ...props,
                y: Math.min(props.y - d, props.y + props.size),
                size: Math.max(0, props.size + d),
            }
        });
    }

    function resizeBottomLeft(payload: DragActionPayload) {
        onChange(props => {
            const d = Math.max(props.x - payload.position.x, payload.position.y - props.y - props.size);
            return {
                ...props,
                x: Math.min(props.x - d, props.x + props.size),
                size: Math.max(0, props.size + d),
            }
        });
    }

    function resizeBottomRight(payload: DragActionPayload) {
        onChange(props => {
            const d = Math.max(payload.position.x - props.x - props.size, payload.position.y - props.y - props.size);
            return {
                ...props,
                size: Math.max(0, props.size + d),
            }
        });
    }

    function resizeLeft(payload: DragActionPayload) {
        onChange(props => ({
            ...props,
            x: Math.min(payload.position.x, props.x + props.size), 
            size: Math.max(0, props.x + props.size - payload.position.x),
        }));
    }

    function resizeTop(payload: DragActionPayload) {
        onChange(props => ({
            ...props, 
            y: Math.min(payload.position.y, props.y + props.size), 
            size: Math.max(0, props.y + props.size - payload.position.y)
        }));
    }

    function resizeRight(payload: DragActionPayload) {
        onChange(props => ({
            ...props,
            size: Math.max(0, payload.position.x - props.x),
        }));
    }

    function resizeBottom(payload: DragActionPayload) {
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

    const collider = options?.collider?.(props) || defaultCollider();
    let hitArea: HitArea = { type: "in", action: ACT_MOVE, cursor: "move" };
    if (options?.innerHitArea) {
        hitArea = options.innerHitArea(hitArea);
    }
    useCollider(collider, hitArea);
    useAction(hitArea.action, move);

    useAction<ACT_DRAW_POINT_PLACE_Payload>(ACT_DRAW_POINT_PLACE, (payload) => {
        if (payload.pointIndex === 0) {
            onChange(props => ({
                ...props,
                x: payload.position.x,
                y: payload.position.y,
                size: 0
            }));
        }
        else {
            const d = Math.max(payload.position.x - props.x - props.size, payload.position.y - props.y - props.size);
            onChange(props => ({
                ...props,
                size: Math.max(0, props.size + d)
            }));
        }
        payload.result.current = payload.pointIndex > 0;
    });

    useAction<ACT_DRAW_POINT_MOVE_Payload>(ACT_DRAW_POINT_MOVE, (payload) => {
        const d = Math.max(payload.position.x - props.x - props.size, payload.position.y - props.y - props.size);
        onChange(props => ({
            ...props,
            size: Math.max(0, props.size + d)
        }));
    });

    useAction<ACT_DRAW_POINT_CANCEL_Payload>(ACT_DRAW_POINT_CANCEL, (payload) => {
        payload.result.current = false;
    });

    useAction<ACT_PASTE_Payload>(ACT_PASTE, (payload) => {
        onChange(props => ({
            ...props,
            x: props.x + payload.offsetX,
            y: props.y + payload.offsetY
        }));
    });

    useInteractiveRectControls(
        x, y, size, size, resizeTopLeft, resizeTopRight, resizeBottomLeft, resizeBottomRight,
        resizeLeft, resizeTop, resizeRight, resizeBottom
    );    
}

export function withInteractiveSquare<T extends InteractiveSquareProps>(
    WrappedElement: DiagramElement<T>,
    options?: InteractiveSquareOptions<T>
): DiagramElement<T> {
    return (props) => {
        useInteractiveSquare(props, options);
        return <WrappedElement {...props} />;
    }
}