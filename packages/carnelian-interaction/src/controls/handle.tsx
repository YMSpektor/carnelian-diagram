/** @jsxImportSource @carnelian/diagram */

import { DiagramNode, useContext } from "@carnelian/diagram";
import { ActionCallback, ControlsContext, createHitTestProps, HitArea, DragActionPayload, RenderHandleCallback, useAction } from "..";

export interface HandleControlProps {
    element: DiagramNode;
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

export const renderHandleDefault: RenderHandleCallback = (kind, x, y, otherProps) => {
    let size = 8;
    switch (kind) {
        case "knob":
            size = 9;
            const points = [
                {x: x - size / 2, y},
                {x, y: y - size / 2},
                {x: x + size / 2, y},
                {x, y: y + size / 2}
            ];
            return <polygon points={points.map(p => `${p.x},${p.y}`).join(" ")} fill="orange" {...otherProps} />
        default:
            return <rect x={x - size / 2} y={y - size / 2} width={size} height={size} fill="yellow" {...otherProps} />
    }
}