/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";
import { PolygonCollider } from "@carnelian/interaction/collisions";
import { clamp } from "@carnelian/interaction/geometry";
import { RectBaseProps } from ".";
import { withInteractiveRect, KnobController, withKnob } from "../interaction";
import { convertPercentage, isPercentage, NumberOrPercentage } from "../utils";

export interface TrapezoidProps extends RectBaseProps {
    offset: NumberOrPercentage;
}

const knobController: KnobController<TrapezoidProps> = {
    hitArea: {
        type: "knob_handle",
        cursor: "default",
        action: "knob_move"
    },
    getPosition(props) {
        const base = props.width;
        const offset = clamp(convertPercentage(props.offset, base), 0, base / 2);
        return {
            x: props.x + offset,
            y: props.y
        }
    },
    setPosition(props, pos) {
        const base = props.width;
        let offset: NumberOrPercentage = clamp(pos.x - props.x, 0, base / 2);
        offset = isPercentage(props.offset) 
            ? base > 0 ? `${offset / base * 100}%` : props.offset
            : offset
        return {
            ...props,
            offset
        }
    }
}

function toPolygon(props: TrapezoidProps) {
    let { x, y, width, height, offset } = props;

    offset = clamp(convertPercentage(offset, width), 0, width / 2);
    return [
        {x: x + offset, y},
        {x: x + width - offset, y},
        {x: x + width, y: y + height},
        {x, y: y + height}
    ];
}

export const Trapezoid: DiagramElement<TrapezoidProps> = function(props) {
    let { onChange, x, y, width, height, offset, ...rest } = props;
    const points = toPolygon(props);

    return (
        <polygon points={points.map(p => `${p.x},${p.y}`).join(" ")} {...rest} />
    );
};

export const InteractiveTrapezoid = 
    withInteractiveRect(
        withKnob(knobController, Trapezoid),
        (props) => PolygonCollider(toPolygon(props))
    );