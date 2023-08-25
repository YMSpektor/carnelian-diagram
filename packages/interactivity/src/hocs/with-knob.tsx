/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement, DiagramElementProps } from "@carnelian-diagram/core";
import { HandleControl, HitArea, DragActionPayload, useControls } from "..";
import { Point } from "../geometry";

export interface KnobController<T extends object, D = any> {
    kind?: string;
    hitArea: HitArea<D> | ((props: T) => HitArea<D>);
    getPosition(props: T, transform: DOMMatrixReadOnly): Point;
    setPosition<D>(props: T, payload: DragActionPayload, hitArea: HitArea<D>): T;
}

export function useKnob<T extends object>(knobController: KnobController<T>, props: DiagramElementProps<T>) {
    function dragHandler(payload: DragActionPayload) {
        props.onChange(props => knobController.setPosition(props, payload, payload.hitArea));
    }

    useControls((transform, element) => {
        const kind = knobController.kind || "knob";
        const pos = knobController.getPosition(props, transform);
        const hitArea = typeof knobController.hitArea === "function" ? knobController.hitArea(props) : knobController.hitArea;

        return (
            <HandleControl
                kind={kind}
                x={pos.x} y={pos.y}
                hitArea={hitArea}
                transform={transform} 
                element={element}
                onDrag={dragHandler}
            />
        )
    });
}

export function withKnob<T extends object>(WrappedElement: DiagramElement<T>, knobController: KnobController<T>): DiagramElement<T> {
    return (props) => {
        useKnob(knobController, props);        
        return <WrappedElement {...props} />;
    }
}

export function withKnobs<T extends object>(WrappedElement: DiagramElement<T>, ...knobControllers: KnobController<T>[]): DiagramElement<T> {
    return (props) => {
        knobControllers.forEach(knobController => useKnob(knobController, props));        
        return <WrappedElement {...props} />;
    }
}