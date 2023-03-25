/** @jsxImportSource carnelian-diagram */

import { DiagramNode } from "carnelian-diagram";
import { ActionCallback, createHitTestProps, HitArea, MovementActionPayload, useAction } from "carnelian-diagram/interactions";

export interface HandleControlProps {
    element: DiagramNode;
    x: number;
    y: number;
    size: number;
    hitArea: HitArea,
    transform: DOMMatrixReadOnly;
    onDrag: ActionCallback<MovementActionPayload>;
}

export function HandleControl(props: HandleControlProps) {
    const p = new DOMPoint(props.x, props.y).matrixTransform(props.transform);
    const hitTestProps = createHitTestProps(props.hitArea, props.element);

    useAction<MovementActionPayload>(props.hitArea.action, (payload) => {
        if (props.hitArea.index === payload.hitArea.index) {
            props.onDrag(payload);
        }
    }, props.element);

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