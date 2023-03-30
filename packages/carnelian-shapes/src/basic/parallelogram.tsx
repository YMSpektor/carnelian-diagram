/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";
import { clamp } from "@carnelian/diagram/geometry";
import { RectBaseProps } from ".";
import { withInteractiveRect, KnobController, withKnob } from "../interaction";
import { convertPercentage, isPercentage, NumberOrPercentage } from "../utils";

export interface ParallelogramProps extends RectBaseProps {
    offset: NumberOrPercentage;
}

const knobController: KnobController<ParallelogramProps> = {
    hitArea: {
        type: "knob_handle",
        cursor: "default",
        action: "knob_move"
    },
    getPosition(props) {
        const offset = clamp(convertPercentage(props.offset, props.width), 0, props.width);
        return {
            x: props.x + offset,
            y: props.y
        }
    },
    setPosition(props, pos) {
        let offset: NumberOrPercentage = clamp(pos.x - props.x, 0, props.width);
        offset = isPercentage(props.offset) 
            ? props.width > 0 ? `${offset / props.width * 100}%` : props.offset
            : offset
        return {
            ...props,
            offset
        }
    }
}

export const Parallelogram: DiagramElement<ParallelogramProps> = function(props) {
    let { onChange, x, y, width, height, offset, ...rest } = props;

    offset = clamp(convertPercentage(offset, width), 0, width);
    const points = [
        {x: x + offset, y},
        {x: x + width, y},
        {x: x +width - offset, y: y + height},
        {x, y: y + height}
    ];

    return (
        <polygon points={points.map(p => `${p.x},${p.y}`).join(" ")} {...rest} />
    );
};

export const InteractiveParallelogram = 
    withInteractiveRect(
        withKnob(knobController, Parallelogram)
    );