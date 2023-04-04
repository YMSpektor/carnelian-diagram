/** @jsxImportSource @carnelian/diagram */

import { DiagramElement, DiagramElementProps } from "@carnelian/diagram";
import { HandleControl, HitArea, MovementActionPayload, useControls } from "@carnelian/interaction";
import { Point } from "@carnelian/interaction/geometry";

export interface KnobController<T extends object, D = any> {
    hitArea: HitArea<D> | ((props: T) => HitArea<D>);
    getPosition(props: T): Point;
    setPosition<D>(props: DiagramElementProps<T>, pos: Point, hitArea: HitArea<D>): DiagramElementProps<T>;
}

export function withKnob<T extends object>(knobController: KnobController<T>, WrappedElement: DiagramElement<T>): DiagramElement<T> {
    return (props) => {
        useKnob(knobController, props);        
        return <WrappedElement {...props} />;
    }
}

export function useKnob<T extends object>(knobController: KnobController<T>, props: DiagramElementProps<T>) {
    const pos = knobController.getPosition(props);
    const hitArea = typeof knobController.hitArea === "function" ? knobController.hitArea(props) : knobController.hitArea;

    function dragHandler(payload: MovementActionPayload) {
        props.onChange(props => knobController.setPosition(props, payload.position, payload.hitArea));
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