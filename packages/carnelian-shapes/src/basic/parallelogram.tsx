/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";
import { clamp } from "@carnelian/diagram/geometry";
import { RectBaseProps } from ".";
import { withInteractiveRect, KnobController, withKnob } from "../interaction";

export interface ParallelogramProps extends RectBaseProps {
    offset: number;
}

const knobController: KnobController<ParallelogramProps> = {
    hitArea: {
        type: "knob_handle",
        cursor: "default",
        action: "knob_move"
    },
    getPosition(props) {
        return {
            x: props.x + Math.min(props.offset, props.width),
            y: props.y
        }
    },
    setPosition(props, pos) {
        return {
            ...props,
            offset: clamp(pos.x - props.x, 0, props.width)
        }
    }
}

export const Parallelogram: DiagramElement<ParallelogramProps> = function(props) {
    let { onChange, x, y, width, height, offset, ...rest } = props;
    offset = Math.min(offset, width);
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