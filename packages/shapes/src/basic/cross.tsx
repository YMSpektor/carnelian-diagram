/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { PolygonCollider, KnobController, withKnob } from "@carnelian-diagram/interactivity";
import { clamp } from "@carnelian-diagram/interactivity/geometry";
import { RectBaseProps } from "..";
import { withInteractiveRotatableRect, withInteractiveRotatableTextRect } from "../hocs";
import { convertPercentage, isPercentage, NumberOrPercentage } from "../utils";

export interface CrossProps extends RectBaseProps {
    offsetX: NumberOrPercentage;
    offsetY: NumberOrPercentage;
}

const knobController: KnobController<CrossProps> = {
    hitArea: {
        type: "knob_handle",
        cursor: "default",
        action: "offset_x_knob_move"
    },
    getPosition(props) {
        const baseX = props.width;
        const baseY = props.height;
        const offsetX = clamp(convertPercentage(props.offsetX, baseX), 0, baseX / 2);
        const offsetY = clamp(convertPercentage(props.offsetY, baseY), 0, baseY / 2);
        return {
            x: props.x + offsetX,
            y: props.y + offsetY
        }
    },
    setPosition(props, {position}) {
        const baseX = props.width;
        const baseY = props.height;
        let offsetX: NumberOrPercentage = clamp(position.x - props.x, 0, baseX / 2);
        let offsetY: NumberOrPercentage = clamp(position.y - props.y, 0, baseY / 2);
        offsetX = isPercentage(props.offsetX) 
            ? baseX > 0 ? `${offsetX / baseX * 100}%` : props.offsetX
            : offsetX;
        offsetY = isPercentage(props.offsetY) 
            ? baseY > 0 ? `${offsetY / baseY * 100}%` : props.offsetY
            : offsetY;
        return {
            ...props,
            offsetX,
            offsetY
        }
    }
}

function toPolygon(props: CrossProps) {
    let { x, y, width, height, offsetX, offsetY } = props;

    offsetX = clamp(convertPercentage(offsetX, width), 0, width / 2);
    offsetY = clamp(convertPercentage(offsetY, height), 0, height / 2);
    return [
        {x: x + offsetX, y},
        {x : x + width - offsetX, y},
        {x : x + width - offsetX, y: y + offsetY},
        {x : x + width, y: y + offsetY},
        {x : x + width, y: y + height - offsetY},
        {x : x + width - offsetX, y: y + height - offsetY},
        {x : x + width - offsetX, y: y + height},
        {x : x + offsetX, y: y + height},
        {x : x + offsetX, y: y + height - offsetY},
        {x, y: y + height - offsetY},
        {x, y: y + offsetY},
        {x: x + offsetX, y: y + offsetY}
    ];
};

const CrossColliderFactory = (props: CrossProps) => PolygonCollider(toPolygon(props));

export const Cross: DiagramElement<CrossProps> = function(props) {
    let { onChange, x, y, width, height, offsetX, offsetY, ...rest } = props;
    const points = toPolygon(props);

    return (
        <polygon points={points.map(p => `${p.x},${p.y}`).join(" ")} {...rest} />
    );
};

export const InteractiveCross = withInteractiveRotatableRect(
    withKnob(Cross, knobController), 
    CrossColliderFactory
);

export const InteractiveCrossWithText = withInteractiveRotatableTextRect(
    withKnob(Cross, knobController), 
    CrossColliderFactory
);
