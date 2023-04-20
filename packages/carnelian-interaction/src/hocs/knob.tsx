/** @jsxImportSource @carnelian/diagram */

import { DiagramElement, DiagramElementProps } from "@carnelian/diagram";
import { HandleControl, HitArea, DragActionPayload, useControls } from "..";
import { Point } from "../geometry";

export interface KnobController<T extends object, D = any> {
    hitArea: HitArea<D> | ((props: T) => HitArea<D>);
    getPosition(props: T): Point;
    setPosition<D>(props: DiagramElementProps<T>, payload: DragActionPayload, hitArea: HitArea<D>): DiagramElementProps<T>;
}

export function useKnob<T extends object>(knobController: KnobController<T>, props: DiagramElementProps<T>) {
    const pos = knobController.getPosition(props);
    const hitArea = typeof knobController.hitArea === "function" ? knobController.hitArea(props) : knobController.hitArea;

    function dragHandler(payload: DragActionPayload) {
        props.onChange(props => knobController.setPosition(props, payload, payload.hitArea));
    }

    useControls((transform, element) => {
        return (
            <HandleControl
                kind="knob"
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