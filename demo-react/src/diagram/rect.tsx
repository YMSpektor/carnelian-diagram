/** @jsxImportSource carnelian-diagram */

import { useContext, DiagramElement } from "carnelian-diagram";
import { useControls, useHitTest, rectHitTest, InteractionContext, useAction, MovementActionPayload, ActionCallback } from "carnelian-diagram/interactivity";
import { HandleControl } from "./handle";

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

    function createControl(index: number, x: number, y: number, cursor: string, dragHandler: ActionCallback<MovementActionPayload>) {
        return {
            pos: new DOMPoint(x, y),
            hitArea: {
                type: "resize_handle",
                index,
                cursor,
                action: "resize_handle_move"
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
        const controls = isSelected ? [
            createControl(0, props.x, props.y, "nwse-resize", resizeTopLeft),
            createControl(1, props.x + props.width, props.y, "nesw-resize", resizeTopRight),
            createControl(2, props.x, props.y + props.height, "nesw-resize", resizeBottomLeft),
            createControl(3, props.x + props.width, props.y + props.height, "nwse-resize", resizeBottomRight),
        ] : [];

        return (
            <>
                { controls.map(control => (
                    <HandleControl
                        key={control.hitArea.index}
                        x={control.pos.x} y={control.pos.y} size={8} hitArea={control.hitArea}
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