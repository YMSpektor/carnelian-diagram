/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { KnobController, PolygonCollider, withKnob } from "@carnelian-diagram/interactivity";
import { clamp } from "@carnelian-diagram/interactivity/geometry";
import { RectBaseProps } from "..";
import { withInteractiveRotatableRect, withInteractiveRotatableTextRect } from "../hocs";
import { convertPercentage, isPercentage, NumberOrPercentage } from "../utils";

export interface Star4Props extends RectBaseProps {
    offsetX: NumberOrPercentage;
    offsetY: NumberOrPercentage;
}

const knobController: KnobController<Star4Props> = {
    hitArea: (props) => ({
        type: "knob_handle",
        cursor: "default",
        action: "knob_move"
    }),
    getPosition(props) {
        const offsetX = clamp(convertPercentage(props.offsetX, props.width / 2), 0, props.width / 2);
        const offsetY = clamp(convertPercentage(props.offsetY, props.height / 2), 0, props.height / 2);
        return {
            x: props.x + props.width / 2 - offsetX,
            y: props.y + props.height / 2 - offsetY
        }
    },
    setPosition(props, {position}) {
        let offsetX: NumberOrPercentage = props.x + props.width / 2 - position.x;
        offsetX = clamp(offsetX, 0, props.width / 2);
        offsetX = isPercentage(props.offsetX) 
            ? props.width > 0 ? `${offsetX / (props.width / 2) * 100}%` : props.offsetX
            : offsetX;
        let offsetY: NumberOrPercentage = props.y + props.height / 2 - position.y;
        offsetY = clamp(offsetY, 0, props.height / 2);
        offsetY = isPercentage(props.offsetY) 
            ? props.height > 0 ? `${offsetY / (props.height / 2) * 100}%` : props.offsetY
            : offsetY;
        return {
            ...props,
            offsetX,
            offsetY
        }
    }
}

function toPolygon(props: Star4Props) {
    let { x, y, width, height, offsetX, offsetY } = props;

    offsetX = clamp(convertPercentage(offsetX, width / 2), 0, width / 2);
    offsetY = clamp(convertPercentage(offsetY, height / 2), 0, height / 2);
    return [
        {x, y: y + height / 2},
        {x: x + width / 2 - offsetX, y: y + height / 2 - offsetY},
        {x: x + width / 2, y},
        {x: x + width / 2 + offsetX, y: y + height / 2 - offsetY},
        {x: x + width, y: y + height / 2},
        {x: x + width / 2 + offsetX, y: y + height / 2 + offsetY},
        {x: x + width / 2, y: y + height},
        {x: x + width / 2 - offsetX, y: y + height / 2 + offsetY}
    ];
};

const Star4ColliderFactory = (props: Star4Props) => PolygonCollider(toPolygon(props));

export const Star4: DiagramElement<Star4Props> = function(props) {
    let { onChange, x, y, width, height, offsetX, offsetY, ...rest } = props;
    const points = toPolygon(props);

    return (
        <polygon points={points.map(p => `${p.x},${p.y}`).join(" ")} {...rest} />
    );
};

export const InteractiveStar4 = withInteractiveRotatableRect(
    withKnob(Star4, knobController), 
    Star4ColliderFactory
);

export const InteractiveStar4WithText = withInteractiveRotatableTextRect(
    withKnob(Star4, knobController), 
    Star4ColliderFactory
);