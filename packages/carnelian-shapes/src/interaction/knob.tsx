/** @jsxImportSource @carnelian/diagram */

import { DiagramElement, DiagramElementProps } from "@carnelian/diagram";
import { Point } from "@carnelian/diagram/geometry";
import { HandleControl, HitArea, MovementActionPayload, useControls } from "@carnelian/interaction";

export interface KnobController<T extends object> {
    hitArea: HitArea;
    getPosition(props: T): Point;
    setPosition(props: DiagramElementProps<T>, pos: Point): DiagramElementProps<T>;
}

export function withKnob<T extends object>(knobController: KnobController<T>, WrappedElement: DiagramElement<T>): DiagramElement<T> {
    return (props) => {
        useKnob(knobController, props);        
        return <WrappedElement {...props} />;
    }
}

export function useKnob<T extends object>(knobController: KnobController<T>, props: DiagramElementProps<T>) {
    const pos = knobController.getPosition(props);

    function dragHandler(payload: MovementActionPayload) {
        props.onChange(props => knobController.setPosition(props, payload.position));
    }

    useControls((transform, element) => {
        return (
            <HandleControl
                kind="knob"
                x={pos.x} y={pos.y}
                hitArea={knobController.hitArea}
                transform={transform} 
                element={element}
                onDrag={dragHandler}
            />
        )
    });
}