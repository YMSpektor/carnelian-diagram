/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { KnobController, withKnob } from "@carnelian-diagram/interaction";
import { clamp } from "@carnelian-diagram/interaction/geometry";
import { RectBaseProps } from "..";
import { withInteractiveRotatableRect, withInteractiveRotatableTextRect } from "../hocs";
import { convertPercentage, isPercentage, NumberOrPercentage } from "../utils";

export interface BlockProps extends RectBaseProps {
    offset: NumberOrPercentage;
}

const knobController: KnobController<BlockProps, number> = {
    hitArea: (props) => ({
        type: "knob_handle",
        cursor: "default",
        action: "knob_move"
    }),
    getPosition(props) {
        const offset = clamp(convertPercentage(props.offset, props.width), 0, props.width / 2);
        return {
            x: props.x + Math.abs(offset),
            y: props.y
        }
    },
    setPosition(props, {position}) {
        let offset: NumberOrPercentage = clamp(position.x - props.x, 0, props.width / 2);
        offset = isPercentage(props.offset) 
            ? props.width > 0 ? `${offset / props.width * 100}%` : props.offset
            : offset
        return {
            ...props,
            offset
        }
    }
}

export const Block: DiagramElement<BlockProps> = function(props) {
    let { x, y, width, height, offset, style } = props;
    offset = clamp(convertPercentage(offset, width), 0, width / 2);

    return (
        <g style={style}>
            <rect x={x} y={y} width={width} height={height} />
            <line x1={x + offset} y1={y} x2={x + offset} y2={y + height} />
            <line x1={x + width - offset} y1={y} x2={x + width - offset} y2={y + height} />
        </g>
    );
}

export const InteractiveBlock = withInteractiveRotatableRect(
    withKnob(Block, knobController)
);

export const InteractiveBlockWithText = withInteractiveRotatableTextRect(
    withKnob(Block, knobController)
);