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

    useHitTest(
        rectHitTest(props.x, props.y, props.width, props.height),
        { type: "in" }
    );

    useControls((transform, element) => {
        const points = isSelected ? [
            new DOMPoint(props.x, props.y),
            new DOMPoint(props.x + props.width, props.y),
            new DOMPoint(props.x, props.y + props.height),
            new DOMPoint(props.x + props.width, props.y + props.height)
        ] : [];

        return (
            <>
                { points.map(p => (
                    <HandleControl x={p.x} y={p.y} size={8} transform={transform} element={element} />
                )) }
            </>
        );
    }, [props, isSelected]);

    return (
        <rect {...props} />
    );
}