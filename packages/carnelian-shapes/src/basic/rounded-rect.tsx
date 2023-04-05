/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";
import { withInteractiveRect, KnobController, withKnob } from "@carnelian/interaction";
import { clamp } from "@carnelian/interaction/geometry";
import { RectBaseProps } from ".";
import { convertPercentage, isPercentage, NumberOrPercentage } from "../utils";

export interface RoundedRectProps extends RectBaseProps {
    radius: NumberOrPercentage;
}

const knobController: KnobController<RoundedRectProps> = {
    hitArea: {
        type: "knob_handle",
        cursor: "default",
        action: "knob_move"
    },
    getPosition(props) {
        const base = Math.min(props.width, props.height) / 2;
        const offset = clamp(convertPercentage(props.radius, base), 0, base);
        return {
            x: props.x + offset,
            y: props.y
        }
    },
    setPosition(props, pos) {
        const base = Math.min(props.width, props.height) / 2;
        let radius: NumberOrPercentage = clamp(pos.x - props.x, 0, base);
        radius = isPercentage(props.radius) 
            ? base > 0 ? `${radius / base * 100}%` : props.radius
            : radius
        return {
            ...props,
            radius
        }
    }
}

export const RoundedRect: DiagramElement<RoundedRectProps> = function(props) {
    let { onChange, radius, ...rest } = props;
    const base = Math.min(props.width, props.height) / 2;
    radius = clamp(convertPercentage(radius, base), 0, base);

    return (
        <rect rx={radius} {...rest} />
    );
};

export const InteractiveRoundedRect = 
    withInteractiveRect(
        withKnob(RoundedRect, knobController)
    );