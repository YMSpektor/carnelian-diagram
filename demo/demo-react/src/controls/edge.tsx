/** @jsxImportSource @carnelian/diagram */

import { DiagramNode } from "@carnelian/diagram";
import { ActionCallback, HitArea, lineHitTest, MovementActionPayload, useAction, useHitTest } from "@carnelian/interaction";

export interface EdgeControlProps {
    element: DiagramNode;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    hitArea: HitArea;
    transform: DOMMatrixReadOnly;
    onDrag: ActionCallback<MovementActionPayload>;
}

export function EdgeControl(props: EdgeControlProps) {
    const p1 = new DOMPoint(props.x1, props.y1).matrixTransform(props.transform);
    const p2 = new DOMPoint(props.x2, props.y2).matrixTransform(props.transform);
    useHitTest(
        lineHitTest(props.x1, props.y1, props.x2, props.y2, 2),
        props.hitArea,
        1,
        props.element
    );

    useAction<MovementActionPayload>(props.hitArea.action, (payload) => {
        if (props.hitArea.index === payload.hitArea.index) {
            props.onDrag(payload);
        }
    }, props.element);

    return (
        <line 
            className="control-edge"
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
        />
    )
}