/** @jsxImportSource carnelian-diagram */

import { useControls, useHitTest } from "carnelian-diagram";

export interface RectProps {
    x: number;
    y: number;
    width: number;
    height: number;
    stroke?: string;
    fill?: string;
}

export function Rect(props: RectProps) {
    useHitTest((transform, screenPoint, tolerance) => {
        const pt = screenPoint.matrixTransform(transform);
        if (pt.x >= props.x && pt.y >= props.y && pt.x <= props.x + props.width && pt.y <= props.y + props.height) {
            return {
                type: "in"
            }
        }
    });

    useControls((transform) => {
        const p1 = new DOMPoint(props.x, props.y).matrixTransform(transform);

        return (
            <rect x={p1.x - 4} y={p1.y - 4} width={8} height={8} stroke="black" fill="yellow" />
        );
    });

    return (
        <rect {...props} />
    );
}