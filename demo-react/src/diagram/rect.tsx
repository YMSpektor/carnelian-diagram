/** @jsxImportSource carnelian-diagram */

import { useHitTest } from "carnelian-diagram";

export interface RectProps {
    x: number;
    y: number;
    width: number;
    height: number;
    stroke?: string;
    fill?: string;
}

export function Rect(props: RectProps) {
    useHitTest((transform, screenPoint) => {
        const pt = screenPoint.matrixTransform(transform);
        if (pt.x >= props.x && pt.y >= props.y && pt.x <= props.x + props.width && pt.y <= props.y + props.height) {
            return {
                type: "in"
            }
        }
    });

    return (
        <rect {...props} />
    );
}