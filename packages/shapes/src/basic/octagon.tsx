/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { PolygonCollider, KnobController, withKnob } from "@carnelian-diagram/interactivity";
import { clamp } from "@carnelian-diagram/interactivity/geometry";
import { RectBaseProps } from "..";
import { withInteractiveRotatableRect, withInteractiveRotatableTextRect } from "../hocs";
import { convertPercentage, isPercentage, NumberOrPercentage } from "../utils";

export interface OctagonProps extends RectBaseProps {
    offset: NumberOrPercentage;
}

const knobController: KnobController<OctagonProps> = {
    hitArea: {
        type: "knob_handle",
        cursor: "default",
        action: "knob_move"
    },
    getPosition(props) {
        const base = Math.min(props.width, props.height);
        const offset = clamp(convertPercentage(props.offset, base), 0, base / 2);
        return {
            x: props.x + offset,
            y: props.y
        }
    },
    setPosition(props, {position}) {
        const base = Math.min(props.width, props.height);
        let offset: NumberOrPercentage = clamp(convertPercentage(position.x - props.x, base), 0, base / 2);
        offset = isPercentage(props.offset) 
            ? base > 0 ? `${offset / base * 100}%` : props.offset
            : offset
        return {
            ...props,
            offset
        }
    }
}

function toPolygon(props: OctagonProps) {
    let { x, y, width, height, offset } = props;

    const base = Math.min(width, height);
    offset = clamp(convertPercentage(offset, base), 0, base / 2);
    return [
        {x, y: y + offset},
        {x: x + offset, y},
        {x: x + width - offset, y},
        {x: x + width, y: y + offset},
        {x: x + width, y: y + height - offset},
        {x: x + width - offset, y: y + height},
        {x: x + offset, y: y + height},
        {x: x, y: y + height - offset}
    ];
};

const OctagonColliderFactory = (props: OctagonProps) => PolygonCollider(toPolygon(props));

export const Octagon: DiagramElement<OctagonProps> = function(props) {
    let { onChange, x, y, width, height, offset, ...rest } = props;
    const points = toPolygon(props);

    return (
        <polygon points={points.map(p => `${p.x},${p.y}`).join(" ")} {...rest} />
    );
};

export const InteractiveOctagon = withInteractiveRotatableRect(
    withKnob(Octagon, knobController), 
    OctagonColliderFactory
);

export const InteractiveOctagonWithText = withInteractiveRotatableTextRect(
    withKnob(Octagon, knobController), 
    OctagonColliderFactory
);