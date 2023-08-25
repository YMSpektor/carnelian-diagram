/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElementNode, useContext } from "@carnelian-diagram/core";
import { ActionCallback, ControlsContext, createHitTestProps, HitArea, DragActionPayload, useAction } from "..";

export interface HandleControlProps {
    element: DiagramElementNode;
    kind: string;
    x: number;
    y: number;
    hitArea: HitArea,
    transform: DOMMatrixReadOnly;
    onDrag?: ActionCallback<DragActionPayload>;
}

export function HandleControl(props: HandleControlProps) {
    const p = new DOMPoint(props.x, props.y).matrixTransform(props.transform);
    const hitTestProps = createHitTestProps(props.hitArea, props.element);
    
    useAction<DragActionPayload>(props.hitArea.action, props.onDrag && ((payload) => {
        if (props.hitArea.index === payload.hitArea.index) {
            props.onDrag?.(payload);
        }
    }), props.element);
    
    const controlsContext = useContext(ControlsContext);

    return controlsContext.renderHandle(props.kind, p.x, p.y, {
        className: `control-handle control-handle-${props.kind}`,
        ...hitTestProps
    });
}