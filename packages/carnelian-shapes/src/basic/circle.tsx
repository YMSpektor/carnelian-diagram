/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";
import { ClosedFigureStyleProps } from ".";
import { KnobController, withInteractiveCircle, withKnob } from "../interaction";

export interface CircleProps extends ClosedFigureStyleProps {
    x: number;
    y: number;
    radius: number;
}

const knobController: KnobController<CircleProps> = {
    hitArea: {
        type: "radius_handle",
        cursor: "default",
        action: "radius_handle_move"
    },
    getPosition(props) {
        return {x: props.x, y: props.y - props.radius}
    },
    setPosition(props, pos) {
        const radius = Math.max(Math.abs(pos.x - props.x), Math.abs(pos.y - props.y));
        return {
            ...props,
            radius
        }
    }
}

export const Circle: DiagramElement<CircleProps> = function(props) {
    let { onChange, x, y, radius, ...rest } = props;

    return (
        <circle cx={x} cy={y} r={radius} {...rest} />
    );
}

export const InteractiveCircle = 
    withInteractiveCircle(
        withKnob(knobController, Circle)
    );