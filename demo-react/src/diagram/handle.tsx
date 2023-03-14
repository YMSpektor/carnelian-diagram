/** @jsxImportSource carnelian-diagram */

import { DiagramNode } from "carnelian-diagram";
import { createHitTestProps } from "carnelian-diagram/interactivity";

export interface HandleControlProps<P> {
    element: DiagramNode;
    x: number;
    y: number;
    size: number;
    transform: DOMMatrixReadOnly;
    onUpdate: (pos: DOMPointReadOnly) => P;
}

export function HandleControl<P>(props: HandleControlProps<P>) {
    const p = new DOMPoint(props.x, props.y).matrixTransform(props.transform);
    const hitTestProps = createHitTestProps<P>(
        {
            type: "handle", 
            dragHandler: (pos, update) => update(props.onUpdate(pos))
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