/** @jsxImportSource carnelian-diagram */

import { useControls, useHitTest, rectHitTest } from "carnelian-diagram/interactivity";

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

    useControls((transform) => {
        const p1 = new DOMPoint(props.x, props.y).matrixTransform(transform);
        const p2 = new DOMPoint(props.x + props.width, props.y + props.height).matrixTransform(transform);

        return (
            <>
                <rect x={p1.x - 4} y={p1.y - 4} width={8} height={8} stroke="black" fill="yellow" />
                <rect x={p2.x - 4} y={p1.y - 4} width={8} height={8} stroke="black" fill="yellow" />
                <rect x={p1.x - 4} y={p2.y - 4} width={8} height={8} stroke="black" fill="yellow" />
                <rect x={p2.x - 4} y={p2.y - 4} width={8} height={8} stroke="black" fill="yellow" />
            </>
        );
    });

    return (
        <rect {...props} />
    );
}