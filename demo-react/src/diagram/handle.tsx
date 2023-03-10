/** @jsxImportSource carnelian-diagram */

import { DiagramNode } from "carnelian-diagram";
import { useHitTest, pointHitTest } from "carnelian-diagram/interactivity";

export interface HandleControlProps {
    element: DiagramNode;
    x: number;
    y: number;
    size: number;
    transform: DOMMatrixReadOnly;
}

export function HandleControl(props: HandleControlProps) {
    const p = new DOMPoint(props.x, props.y).matrixTransform(props.transform);

    useHitTest(
        pointHitTest(props.x, props.y, props.size / 2),
        { type: "handle", priority: 2 },
        props.element
    );

    return (
        <rect x={p.x - props.size / 2} y={p.y - props.size / 2} width={props.size} height={props.size} stroke="black" fill="yellow" />
    )
}