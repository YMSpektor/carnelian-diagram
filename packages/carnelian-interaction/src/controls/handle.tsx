/** @jsxImportSource @carnelian/diagram */

import { DiagramNode, useContext } from "@carnelian/diagram";
import { ActionCallback, ControlsContext, createHitTestProps, HitArea, MovementActionPayload, RenderHandleCallback, useAction } from "..";

export interface HandleControlProps {
    element: DiagramNode;
    kind: string;
    x: number;
    y: number;
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
    
    const controlsContext = useContext(ControlsContext);

    return controlsContext.renderHandle(props.kind, p.x, p.y, {
        className: `control-handle control-handle-${props.kind}`,
        ...hitTestProps
    });
}

export const renderHandleDefault: RenderHandleCallback = (kind, x, y, otherProps) => {
    const size = 8;
    return (
        <rect x={x - size / 2} y={y - size / 2} width={size} height={size} fill="yellow" {...otherProps} />
    )
}