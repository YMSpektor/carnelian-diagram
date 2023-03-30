/** @jsxImportSource @carnelian/diagram */

import { DiagramElement, DiagramElementProps } from "@carnelian/diagram";
import { clamp } from "@carnelian/diagram/geometry";
import { RectBaseProps } from ".";
import { withInteractiveRect, KnobController, withKnob } from "../interaction";

export interface RoundedRectProps extends RectBaseProps {
    radius: number;
}

const knobController: KnobController<RoundedRectProps> = {
    hitArea: {
        type: "knob_handle",
        cursor: "default",
        action: "knob_move"
    },
    getPosition(props) {
        return {
            x: props.x + props.radius,
            y: props.y
        }
    },
    setPosition(props, pos) {
        return {
            ...props,
            radius: clamp(pos.x - props.x, 0, Math.min(props.width, props.height) / 2)
        }
    }
}

const updateRadius = (
    prevProps: DiagramElementProps<RoundedRectProps>,
    props: DiagramElementProps<RoundedRectProps>
): DiagramElementProps<RoundedRectProps> => {
    const l = Math.min(prevProps.width, prevProps.height) / 2;
    const p = l > 0 ? prevProps.radius / l : 0;
    return {
        ...props,
        radius: p * Math.min(props.width, props.height) / 2
    }
}

export const RoundedRect: DiagramElement<RoundedRectProps> = function(props) {
    let { onChange, radius, ...rest } = props;
    radius = Math.min(radius, Math.min(props.width, props.height) / 2);

    return (
        <rect rx={radius} {...rest} />
    );
};

export const InteractiveRoundedRect = 
    withInteractiveRect(
        withKnob(knobController, RoundedRect),
        updateRadius
    );