/** @jsxImportSource carnelian-diagram */

import { useContext, renderContext } from "carnelian-diagram";
import { useControls, useHitTest, rectHitTest, InteractionContext } from "carnelian-diagram/interactivity";
import { HandleControl } from "./handle";

export interface RectProps {
    x: number;
    y: number;
    width: number;
    height: number;
    stroke?: string;
    fill?: string;
}

export function Rect(props: RectProps) {
    const interactions = useContext(InteractionContext);
    const isSelected = interactions.isSelected(renderContext.currentNode!);

    console.log("Rect: rendering...");

    useHitTest(
        rectHitTest(props.x, props.y, props.width, props.height),
        [props.x, props.y, props.width, props.height],
        { type: "in" },
    );

    useControls((transform, element) => {
        const points = isSelected ? [
            new DOMPoint(props.x, props.y),
            new DOMPoint(props.x + props.width, props.y),
            new DOMPoint(props.x, props.y + props.height),
            new DOMPoint(props.x + props.width, props.y + props.height)
        ] : [];

        const updateFnArray = [
            (pos: DOMPointReadOnly) => ({...props, x: pos.x, y: pos.y}),
            (pos: DOMPointReadOnly) => ({...props, width: pos.x - props.x, y: pos.y}),
            (pos: DOMPointReadOnly) => ({...props, x: pos.x, height: pos.y - props.y}),
            (pos: DOMPointReadOnly) => ({...props, width: pos.x - props.x, height: pos.y - props.y}),
        ]

        return (
            <>
                { points.map((p, i) => (
                    <HandleControl<RectProps> 
                        x={p.x} y={p.y} size={8} 
                        transform={transform} 
                        element={element}
                        onUpdate={(pos) => updateFnArray[i](pos)}
                    />
                )) }
            </>
        );
    }, [props.x, props.y, props.width, props.height, isSelected]);

    return (
        <rect {...props} />
    );
}