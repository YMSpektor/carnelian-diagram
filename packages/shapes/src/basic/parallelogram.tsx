/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { PolygonCollider, KnobController, withKnob, withRotation } from "@carnelian-diagram/interaction";
import { clamp } from "@carnelian-diagram/interaction/geometry";
import { RectBaseProps } from "..";
import { withInteractiveRotatableRect, withInteractiveRotatableTextRect } from "../hocs";
import { convertPercentage, isPercentage, NumberOrPercentage, RectRotation } from "../utils";

export interface ParallelogramProps extends RectBaseProps {
    offset: NumberOrPercentage;
}

const knobController: KnobController<ParallelogramProps, number> = {
    hitArea: (props) => ({
        type: "knob_handle",
        cursor: "default",
        action: "knob_move",
        data: convertPercentage(props.offset, props.width) >= 0 ? 0 : 1
    }),
    getPosition(props) {
        const offset = clamp(convertPercentage(props.offset, props.width), -props.width, props.width);
        return {
            x: props.x + Math.abs(offset),
            y: offset >= 0 ? props.y : props.y + props.height
        }
    },
    setPosition(props, {position}, hitArea) {
        const sign = hitArea.data === 0 ? 1 : -1;
        let offset: NumberOrPercentage = clamp(position.x - props.x, -props.width, props.width) * sign;
        offset = isPercentage(props.offset) 
            ? props.width > 0 ? `${offset / props.width * 100}%` : props.offset
            : offset
        return {
            ...props,
            offset
        }
    }
}

function toPolygon(props: ParallelogramProps) {
    let { x, y, width, height, offset } = props;

    offset = clamp(convertPercentage(offset, width), -width, width);
    return offset >= 0 ? [
        {x: x + offset, y},
        {x: x + width, y},
        {x: x + width - offset, y: y + height},
        {x, y: y + height}
    ] : [
        {x, y},
        {x: x + width + offset, y},
        {x: x + width, y: y + height},
        {x: x - offset, y: y + height}
    ];
}

const ParallelogramColliderFactory = (props: ParallelogramProps) => PolygonCollider(toPolygon(props));

export const RawParallelogram: DiagramElement<ParallelogramProps> = function(props) {
    let { onChange, x, y, width, height, offset, ...rest } = props;
    const points = toPolygon(props);

    return (
        <polygon points={points.map(p => `${p.x},${p.y}`).join(" ")} {...rest} />
    );
};

export const Parallelogram = withRotation(RawParallelogram, RectRotation);

export const InteractiveParallelogram = withInteractiveRotatableRect(
    withKnob(RawParallelogram, knobController), 
    ParallelogramColliderFactory
);

export const InteractiveParallelogramWithText = withInteractiveRotatableTextRect(
    withKnob(RawParallelogram, knobController), 
    ParallelogramColliderFactory
);