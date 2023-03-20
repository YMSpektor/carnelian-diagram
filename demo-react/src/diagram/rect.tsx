/** @jsxImportSource carnelian-diagram */

import { useContext, renderContext, DiagramElementProps } from "carnelian-diagram";
import { useControls, useHitTest, rectHitTest, InteractionContext, useAction, MovementActionPayload } from "carnelian-diagram/interactivity";
import { HandleControl } from "./handle";

export interface RectProps {
    x: number;
    y: number;
    width: number;
    height: number;
    stroke?: string;
    fill?: string;
}

export function Rect(props: DiagramElementProps<RectProps>) {
    const { onChange, ...rest } = props;
    const interactions = useContext(InteractionContext);
    const isSelected = interactions?.isSelected(renderContext.currentNode!);

    console.log("Rect: rendering...");

    useHitTest<RectProps>(
        rectHitTest(props.x, props.y, props.width, props.height),
        { 
            type: "in",
            action: "move",
            cursor: "move",
            onDrag: (curPos, prevPos, startPos, update) => { }
        },
    );

    useAction<MovementActionPayload>("move", (payload) => {
        onChange(props => ({
            ...props,
            x: props.x + payload.deltaX,
            y: props.y + payload.deltaY
        }));
    });

    useControls((transform, element) => {
        const points = isSelected ? [
            new DOMPoint(props.x, props.y),
            new DOMPoint(props.x + props.width, props.y),
            new DOMPoint(props.x, props.y + props.height),
            new DOMPoint(props.x + props.width, props.y + props.height)
        ] : [];

        const cursors = ["nwse-resize", "nesw-resize", "nesw-resize", "nwse-resize"];

        const updateFnArray = [
            (pos: DOMPointReadOnly) => ({
                ...props, 
                x: Math.min(pos.x, props.x + props.width), 
                y: Math.min(pos.y, props.y + props.height), 
                width: Math.max(0, props.x + props.width - pos.x), 
                height: Math.max(0, props.y + props.height - pos.y)
            }),
            (pos: DOMPointReadOnly) => ({
                ...props, 
                y: Math.min(pos.y, props.y + props.height), 
                width: Math.max(0, pos.x - props.x), 
                height: Math.max(0, props.y + props.height - pos.y)
            }),
            (pos: DOMPointReadOnly) => ({
                ...props, 
                x: Math.min(pos.x, props.x + props.width), 
                width: Math.max(0, props.x + props.width - pos.x),
                height: Math.max(0, pos.y - props.y)
            }),
            (pos: DOMPointReadOnly) => ({
                ...props, 
                width: Math.max(0, pos.x - props.x), 
                height: Math.max(0, pos.y - props.y)
            }),
        ];

        return (
            <>
                { points.map((p, i) => (
                    <HandleControl<RectProps> 
                        x={p.x} y={p.y} size={8} cursor={cursors[i]}
                        transform={transform} 
                        element={element}
                        onUpdate={(pos) => updateFnArray[i](pos)}
                    />
                )) }
            </>
        );
    });

    return (
        <rect {...rest} />
    );
}