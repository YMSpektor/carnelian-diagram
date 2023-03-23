/** @jsxImportSource carnelian-diagram */

import { useContext, DiagramElement } from "carnelian-diagram";
import { useControls, useHitTest, rectHitTest, InteractionContext, useAction, MovementActionPayload, ActionCallback } from "carnelian-diagram/interactivity";
import { HandleControl, EdgeControl } from "../controls";

export interface RectProps {
    x: number;
    y: number;
    width: number;
    height: number;
    stroke?: string;
    fill?: string;
}

export const Rect: DiagramElement<RectProps> = function(props) {
    const { onChange, ...rest } = props;
    const interactions = useContext(InteractionContext);
    const isSelected = interactions?.isSelected(this);

    console.log("Rect: rendering...");

    function move(payload: MovementActionPayload) {
        onChange(props => ({
            ...props,
            x: props.x + payload.deltaX,
            y: props.y + payload.deltaY
        }));
    }

    function resizeTopLeft(payload: MovementActionPayload) {
        onChange(props => ({
            ...props,
            x: Math.min(payload.position.x, props.x + props.width), 
            y: Math.min(payload.position.y, props.y + props.height), 
            width: Math.max(0, props.x + props.width - payload.position.x), 
            height: Math.max(0, props.y + props.height - payload.position.y)
        }));
    }

    function resizeTopRight(payload: MovementActionPayload) {
        onChange(props => ({
            ...props,
            y: Math.min(payload.position.y, props.y + props.height), 
            width: Math.max(0, payload.position.x - props.x), 
            height: Math.max(0, props.y + props.height - payload.position.y)
        }));
    }

    function resizeBottomLeft(payload: MovementActionPayload) {
        onChange(props => ({
            ...props,
            x: Math.min(payload.position.x, props.x + props.width), 
            width: Math.max(0, props.x + props.width - payload.position.x),
            height: Math.max(0, payload.position.y - props.y)
        }));
    }

    function resizeBottomRight(payload: MovementActionPayload) {
        onChange(props => ({
            ...props,
            width: Math.max(0, payload.position.x - props.x), 
            height: Math.max(0, payload.position.y - props.y)
        }));
    }

    function resizeLeft(payload: MovementActionPayload) {
        onChange(props => ({
            ...props,
            x: Math.min(payload.position.x, props.x + props.width), 
            width: Math.max(0, props.x + props.width - payload.position.x),
        }));
    }

    function resizeTop(payload: MovementActionPayload) {
        onChange(props => ({
            ...props, 
            y: Math.min(payload.position.y, props.y + props.height), 
            height: Math.max(0, props.y + props.height - payload.position.y)
        }));
    }

    function resizeRight(payload: MovementActionPayload) {
        onChange(props => ({
            ...props,
            width: Math.max(0, payload.position.x - props.x), 
        }));
    }

    function resizeBottom(payload: MovementActionPayload) {
        onChange(props => ({
            ...props,
            height: Math.max(0, payload.position.y - props.y)
        }));
    }

    function createHandleControl(
        index: number, 
        x: number, 
        y: number, 
        cursor: string, 
        dragHandler: ActionCallback<MovementActionPayload>
    ) {
        return {
            x,
            y,
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
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        cursor: string,
        dragHandler: ActionCallback<MovementActionPayload>
    ) {
        return {
            x1,
            y1,
            x2,
            y2,
            hitArea: {
                type: "resize_edge",
                index,
                cursor,
                action: "resize_edge_move"
            },
            dragHandler
        }
    }

    useHitTest(
        rectHitTest(props.x, props.y, props.width, props.height),
        { 
            type: "in",
            action: "move",
            cursor: "move",
        },
    );

    useAction<MovementActionPayload>("move", move);

    useControls((transform, element) => {
        const { x, y, width, height } = props;
        const handles = isSelected ? [
            createHandleControl(0, x, y, "nwse-resize", resizeTopLeft),
            createHandleControl(1, x + width, y, "nesw-resize", resizeTopRight),
            createHandleControl(2, x, y + height, "nesw-resize", resizeBottomLeft),
            createHandleControl(3, x + width, y + height, "nwse-resize", resizeBottomRight),
        ] : [];

        const edges = isSelected ? [
            createEdgeControl(0, x, y, x, y + height, "ew-resize", resizeLeft),
            createEdgeControl(1, x, y, x + width, y, "ns-resize", resizeTop),
            createEdgeControl(2, x + width, y, x + width, y + height, "ew-resize", resizeRight),
            createEdgeControl(3, x, y + height, x + width, y + height, "ns-resize", resizeBottom)
        ] : [];

        return (
            <>
                { edges.map(control => (
                    <EdgeControl
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
                        x={control.x} y={control.y} size={8} hitArea={control.hitArea}
                        transform={transform} 
                        element={element}
                        onDrag={control.dragHandler}
                    />
                )) }
            </>
        );
    });

    return (
        <rect {...rest} />
    );
}