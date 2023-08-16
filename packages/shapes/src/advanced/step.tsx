/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { KnobController, PolygonCollider, withKnob } from "@carnelian-diagram/interaction";
import { clamp } from "@carnelian-diagram/interaction/geometry";
import { RectBaseProps } from "..";
import { withInteractiveRotatableRect, withInteractiveRotatableTextRect } from "../hocs";
import { convertPercentage, isPercentage, NumberOrPercentage } from "../utils";

export interface StepProps extends RectBaseProps {
    offset: NumberOrPercentage;
}

const knobController: KnobController<StepProps> = {
    hitArea: (props) => ({
        type: "knob_handle",
        cursor: "default",
        action: "knob_move",
        data: convertPercentage(props.offset, props.width) >= 0 ? 0 : 1
    }),
    getPosition(props) {
        const offset = clamp(convertPercentage(props.offset, props.width), -props.width, props.width);
        return offset > 0 ? {
            x: props.x + props.width - offset,
            y: props.y
        } : {
            x: props.x - offset,
            y: props.y
        }
    },
    setPosition(props, {position}, hitArea) {
        const sign = hitArea.data === 0 ? 1 : -1;
        let offset: NumberOrPercentage = hitArea.data === 0 
            ? props.x + props.width - position.x 
            : position.x - props.x;
        offset = clamp(offset, -props.width, props.width) * sign;
        offset = isPercentage(props.offset) 
            ? props.width > 0 ? `${offset / props.width * 100}%` : props.offset
            : offset
        return {
            ...props,
            offset
        }
    }
}

function toPolygon(props: StepProps) {
    let { x, y, width, height, offset } = props;

    offset = clamp(convertPercentage(offset, width), -width, width);
    return offset >= 0 ? [
        {x, y},
        {x: x + width - offset, y},
        {x: x + width, y: y + height / 2},
        {x: x + width - offset, y: y + height},
        {x, y: y + height},
        {x: x + offset, y: y + height / 2}
    ] : [
        {x: x - offset, y},
        {x: x + width, y},
        {x: x + width + offset, y: y + height / 2},
        {x: x + width, y: y + height},
        {x: x - offset, y: y + height},
        {x, y: y + height / 2}
    ];
};

const StepColliderFactory = (props: StepProps) => PolygonCollider(toPolygon(props));

export const Step: DiagramElement<StepProps> = function(props) {
    let { onChange, x, y, width, height, offset, ...rest } = props;
    const points = toPolygon(props);

    return (
        <polygon points={points.map(p => `${p.x},${p.y}`).join(" ")} {...rest} />
    );
};

export const InteractiveStep = withInteractiveRotatableRect(
    withKnob(Step, knobController), 
    StepColliderFactory
);

export const InteractiveStepWithText = withInteractiveRotatableTextRect(
    withKnob(Step, knobController), 
    StepColliderFactory
);