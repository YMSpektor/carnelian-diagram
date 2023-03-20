/** @jsxImportSource carnelian-diagram */

import { DiagramNode } from "carnelian-diagram";
import { createHitTestProps } from "carnelian-diagram/interactivity";

export interface HandleControlProps {
    element: DiagramNode;
    x: number;
    y: number;
    size: number;
    index: number;
    action: string;
    cursor: string;
    transform: DOMMatrixReadOnly;
}

export function HandleControl(props: HandleControlProps) {
    const p = new DOMPoint(props.x, props.y).matrixTransform(props.transform);
    const hitTestProps = createHitTestProps(
        {
            type: "handle",
            index: props.index,
            action: props.action,
            cursor: props.cursor,
        }, 
        props.element
    );

    return (
        <rect 
            x={p.x - props.size / 2} 
            y={p.y - props.size / 2} 
            width={props.size} 
            height={props.size} 
            stroke="black" 
            fill="yellow"
            {...hitTestProps}
        />
    )
}