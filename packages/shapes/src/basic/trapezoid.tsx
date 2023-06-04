/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { PolygonCollider, KnobController, withKnob } from "@carnelian-diagram/interaction";
import { clamp } from "@carnelian-diagram/interaction/geometry";
import { RectBaseProps } from "..";
import { withInteractiveRotatableRect, withInteractiveRotatableTextRect } from "../hocs";
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
    setPosition(props, {position}) {
        const base = props.width;
        let offset: NumberOrPercentage = clamp(position.x - props.x, 0, base / 2);
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

const TrapezoidColliderFactory = (props: TrapezoidProps) => PolygonCollider(toPolygon(props));

export const Trapezoid: DiagramElement<TrapezoidProps> = function(props) {
    let { onChange, x, y, width, height, offset, ...rest } = props;
    const points = toPolygon(props);

    return (
        <polygon points={points.map(p => `${p.x},${p.y}`).join(" ")} {...rest} />
    );
};

export const InteractiveTrapezoid = withInteractiveRotatableRect(
    withKnob(Trapezoid, knobController), 
    TrapezoidColliderFactory
);

export const InteractiveTrapezoidWithText = withInteractiveRotatableTextRect(
    withKnob(Trapezoid, knobController), 
    TrapezoidColliderFactory
);
