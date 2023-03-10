/** @jsxImportSource carnelian-diagram */

import { useControls, useHitTest, rectHitTest } from "carnelian-diagram/interactivity";
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
    useHitTest(
        rectHitTest(props.x, props.y, props.width, props.height),
        { type: "in", priority: 0 }
    );

    useControls((transform, element) => {
        const points = [
            new DOMPoint(props.x, props.y),
            new DOMPoint(props.x + props.width, props.y),
            new DOMPoint(props.x, props.y + props.height),
            new DOMPoint(props.x + props.width, props.y + props.height)
        ];

        return (
            <>
                { points.map(p => (
                    <HandleControl x={p.x} y={p.y} size={8} transform={transform} element={element} />
                )) }
            </>
        );
    });

    return (
        <rect {...props} />
    );
}