/** @jsxImportSource @carnelian/diagram */

import { DiagramNode, useContext } from "@carnelian/diagram";
import { ActionCallback, ControlsContext, HitArea, lineHitTest, DragActionPayload, useAction, useHitTest } from "..";

export interface EdgeControlProps {
    element: DiagramNode;
    kind: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    hitArea: HitArea;
    transform: DOMMatrixReadOnly;
    onDrag?: ActionCallback<DragActionPayload>;
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

    useAction<DragActionPayload>(props.hitArea.action, props.onDrag && ((payload) => {
        if (props.hitArea.index === payload.hitArea.index) {
            props.onDrag?.(payload);
        }
    }), props.element);

    const controlsContext = useContext(ControlsContext);

    return controlsContext.renderEdge(props.kind, p1.x, p1.y, p2.x, p2.y, {
        className: `control-edge control-edge-${props.kind}`
    });
}