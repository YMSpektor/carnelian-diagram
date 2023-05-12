/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement, DiagramElementProps } from "@carnelian-diagram/core";
import { 
    useControls, 
    useAction, 
    DragActionPayload, 
    ActionCallback, 
    EdgeControl, 
    HandleControl,
    useCollider,
    ACT_MOVE,
    ACT_DRAW_POINT_PLACE_Payload,
    ACT_DRAW_POINT_PLACE,
    ACT_DRAW_POINT_MOVE,
    ACT_DRAW_POINT_MOVE_Payload,
    ACT_DRAW_POINT_CANCEL,
    ACT_DRAW_POINT_CANCEL_Payload,
    HitArea
} from "..";
import { Collider, RectCollider } from "../collisions";

export interface InteractiveRectProps {
    x: number;
    y: number;
    width: number;
    height: number;
}

export type RectColliderFactory<T extends InteractiveRectProps> = (props: T) => Collider<any>;

export interface InteractiveRectOptions<T extends InteractiveRectProps> {
    collider?: RectColliderFactory<T>;
    innerHitArea?: (hitArea: HitArea) => HitArea;
}

export function useInteractiveRect<T extends InteractiveRectProps>(
    props: DiagramElementProps<T>, 
    options?: InteractiveRectOptions<T>
) {
    const { x, y, width, height, onChange } = props;

    function move(payload: DragActionPayload) {
        onChange(props => ({
            ...props,
            x: props.x + payload.deltaX,
            y: props.y + payload.deltaY
        }));
    }

    function resizeTopLeft(payload: DragActionPayload) {
        onChange(props => ({
            ...props,
            x: Math.min(payload.position.x, props.x + props.width), 
            y: Math.min(payload.position.y, props.y + props.height), 
            width: Math.max(0, props.x + props.width - payload.position.x), 
            height: Math.max(0, props.y + props.height - payload.position.y)
        }));
    }

    function resizeTopRight(payload: DragActionPayload) {
        onChange(props => ({
            ...props,
            y: Math.min(payload.position.y, props.y + props.height), 
            width: Math.max(0, payload.position.x - props.x), 
            height: Math.max(0, props.y + props.height - payload.position.y)
        }));
    }

    function resizeBottomLeft(payload: DragActionPayload) {
        onChange(props => ({
            ...props,
            x: Math.min(payload.position.x, props.x + props.width), 
            width: Math.max(0, props.x + props.width - payload.position.x),
            height: Math.max(0, payload.position.y - props.y)
        }));
    }

    function resizeBottomRight(payload: DragActionPayload) {
        onChange(props => ({
            ...props,
            width: Math.max(0, payload.position.x - props.x), 
            height: Math.max(0, payload.position.y - props.y)
        }));
    }

    function resizeLeft(payload: DragActionPayload) {
        onChange(props => ({
            ...props,
            x: Math.min(payload.position.x, props.x + props.width), 
            width: Math.max(0, props.x + props.width - payload.position.x),
        }));
    }

    function resizeTop(payload: DragActionPayload) {
        onChange(props => ({
            ...props, 
            y: Math.min(payload.position.y, props.y + props.height), 
            height: Math.max(0, props.y + props.height - payload.position.y)
        }));
    }

    function resizeRight(payload: DragActionPayload) {
        onChange(props => ({
            ...props,
            width: Math.max(0, payload.position.x - props.x), 
        }));
    }

    function resizeBottom(payload: DragActionPayload) {
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

    useAction<ACT_DRAW_POINT_CANCEL_Payload>(ACT_DRAW_POINT_CANCEL, (payload) => {
        payload.result.current = false;
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
    resizeTopLeft: ActionCallback<DragActionPayload>,
    resizeTopRight: ActionCallback<DragActionPayload>,
    resizeBottomLeft: ActionCallback<DragActionPayload>,
    resizeBottomRight: ActionCallback<DragActionPayload>,
    resizeLeft: ActionCallback<DragActionPayload>,
    resizeTop: ActionCallback<DragActionPayload>,
    resizeRight: ActionCallback<DragActionPayload>,
    resizeBottom: ActionCallback<DragActionPayload>
) {
    function createHandleControl(
        index: number, 
        x: number, y: number, 
        cursor: string, 
        dragHandler: ActionCallback<DragActionPayload>
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
        dragHandler: ActionCallback<DragActionPayload>
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
    options?: InteractiveRectOptions<T>
): DiagramElement<T> {
    return (props) => {
        useInteractiveRect(props, options);
        return <WrappedElement {...props} />;
    }
}