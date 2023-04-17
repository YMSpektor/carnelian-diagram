/** @jsxImportSource @carnelian/diagram */

import { DiagramElement, DiagramElementProps } from "@carnelian/diagram";
import { 
    useControls, 
    useAction, 
    DraggingActionPayload, 
    ActionCallback, 
    EdgeControl, 
    HandleControl,
    useCollider,
    ACT_MOVE,
    ACT_DRAW_POINT_PLACE_Payload,
    ACT_DRAW_POINT_PLACE,
    ACT_DRAW_POINT_MOVE,
    ACT_DRAW_POINT_MOVE_Payload
} from "..";
import { Collider, RectCollider } from "../collisions";

export interface InteractiveRectProps {
    x: number;
    y: number;
    width: number;
    height: number;
}

export type RectColliderFactory<T extends InteractiveRectProps> = (props: T) => Collider<any>;

export function useInteractiveRect<T extends InteractiveRectProps>(props: DiagramElementProps<T>, colliderFactory?: RectColliderFactory<T>) {
    const { x, y, width, height, onChange } = props;

    function move(payload: DraggingActionPayload) {
        onChange(props => ({
            ...props,
            x: props.x + payload.deltaX,
            y: props.y + payload.deltaY
        }));
    }

    function resizeTopLeft(payload: DraggingActionPayload) {
        onChange(props => ({
            ...props,
            x: Math.min(payload.position.x, props.x + props.width), 
            y: Math.min(payload.position.y, props.y + props.height), 
            width: Math.max(0, props.x + props.width - payload.position.x), 
            height: Math.max(0, props.y + props.height - payload.position.y)
        }));
    }

    function resizeTopRight(payload: DraggingActionPayload) {
        onChange(props => ({
            ...props,
            y: Math.min(payload.position.y, props.y + props.height), 
            width: Math.max(0, payload.position.x - props.x), 
            height: Math.max(0, props.y + props.height - payload.position.y)
        }));
    }

    function resizeBottomLeft(payload: DraggingActionPayload) {
        onChange(props => ({
            ...props,
            x: Math.min(payload.position.x, props.x + props.width), 
            width: Math.max(0, props.x + props.width - payload.position.x),
            height: Math.max(0, payload.position.y - props.y)
        }));
    }

    function resizeBottomRight(payload: DraggingActionPayload) {
        onChange(props => ({
            ...props,
            width: Math.max(0, payload.position.x - props.x), 
            height: Math.max(0, payload.position.y - props.y)
        }));
    }

    function resizeLeft(payload: DraggingActionPayload) {
        onChange(props => ({
            ...props,
            x: Math.min(payload.position.x, props.x + props.width), 
            width: Math.max(0, props.x + props.width - payload.position.x),
        }));
    }

    function resizeTop(payload: DraggingActionPayload) {
        onChange(props => ({
            ...props, 
            y: Math.min(payload.position.y, props.y + props.height), 
            height: Math.max(0, props.y + props.height - payload.position.y)
        }));
    }

    function resizeRight(payload: DraggingActionPayload) {
        onChange(props => ({
            ...props,
            width: Math.max(0, payload.position.x - props.x), 
        }));
    }

    function resizeBottom(payload: DraggingActionPayload) {
        onChange(props => ({
            ...props,
            height: Math.max(0, payload.position.y - props.y)
        }));
    }

    function defaultCollider() {
        const result = RectCollider(props);
        result.bounds = null; // No need to perform broad phase testing for rect colliders
        return result;
    }

    const collider = colliderFactory?.(props) || defaultCollider();
    useCollider(collider, { type: "in", action: ACT_MOVE, cursor: "move" });
    useAction(ACT_MOVE, move);

    useAction<ACT_DRAW_POINT_PLACE_Payload>(ACT_DRAW_POINT_PLACE, (payload) => {
        if (payload.pointIndex === 0) {
            onChange(props => ({
                ...props,
                x: payload.position.x,
                y: payload.position.y,
                width: 0,
                height: 0
            }));
        }
        else {
            onChange(props => ({
                ...props,
                width: Math.max(0, payload.position.x - props.x), 
                height: Math.max(0, payload.position.y - props.y)
            }));
        }
        payload.result.current = payload.pointIndex > 0;
    });

    useAction<ACT_DRAW_POINT_MOVE_Payload>(ACT_DRAW_POINT_MOVE, (payload) => {
        onChange(props => ({
            ...props,
            width: Math.max(0, payload.position.x - props.x), 
            height: Math.max(0, payload.position.y - props.y)
        }));
    });

    useInteractiveRectControls(
        x, y, width, height, resizeTopLeft, resizeTopRight, resizeBottomLeft, resizeBottomRight,
        resizeLeft, resizeTop, resizeRight, resizeBottom
    );
}

export function useInteractiveRectControls(
    x: number,
    y: number,
    width: number,
    height: number,
    resizeTopLeft: ActionCallback<DraggingActionPayload>,
    resizeTopRight: ActionCallback<DraggingActionPayload>,
    resizeBottomLeft: ActionCallback<DraggingActionPayload>,
    resizeBottomRight: ActionCallback<DraggingActionPayload>,
    resizeLeft: ActionCallback<DraggingActionPayload>,
    resizeTop: ActionCallback<DraggingActionPayload>,
    resizeRight: ActionCallback<DraggingActionPayload>,
    resizeBottom: ActionCallback<DraggingActionPayload>
) {
    function createHandleControl(
        index: number, 
        x: number, y: number, 
        cursor: string, 
        dragHandler: ActionCallback<DraggingActionPayload>
    ) {
        return {
            x, y,
            hitArea: {
                type: "resize_handle",
                index,
                cursor,
                action: "resize_handle_move"
            },
            dragHandler
        }
    }

    function createEdgeControl(
        index: number,
        x1: number, y1: number, x2: number, y2: number,
        cursor: string,
        dragHandler: ActionCallback<DraggingActionPayload>
    ) {
        return {
            x1, y1, x2, y2,
            hitArea: {
                type: "resize_edge",
                index,
                cursor,
                action: "resize_edge_move"
            },
            dragHandler
        }
    }

    useControls((transform, element) => {
        const handles = [
            createHandleControl(0, x, y, "nwse-resize", resizeTopLeft),
            createHandleControl(1, x + width, y, "nesw-resize", resizeTopRight),
            createHandleControl(2, x, y + height, "nesw-resize", resizeBottomLeft),
            createHandleControl(3, x + width, y + height, "nwse-resize", resizeBottomRight),
        ];

        const edges = [
            createEdgeControl(0, x, y, x, y + height, "ew-resize", resizeLeft),
            createEdgeControl(1, x, y, x + width, y, "ns-resize", resizeTop),
            createEdgeControl(2, x + width, y, x + width, y + height, "ew-resize", resizeRight),
            createEdgeControl(3, x, y + height, x + width, y + height, "ns-resize", resizeBottom)
        ];

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
                        onDrag={control.dragHandler}
                    />
                ))}
                { handles.map(control => (
                    <HandleControl
                        key={control.hitArea.index}
                        kind="default"
                        x={control.x} y={control.y} hitArea={control.hitArea}
                        transform={transform} 
                        element={element}
                        onDrag={control.dragHandler}
                    />
                )) }
            </>
        );
    });
}

export function withInteractiveRect<T extends InteractiveRectProps>(
    WrappedElement: DiagramElement<T>,
    colliderFactory?: RectColliderFactory<T>
): DiagramElement<T> {
    return (props) => {
        useInteractiveRect(props, colliderFactory);
        return <WrappedElement {...props} />;
    }
}