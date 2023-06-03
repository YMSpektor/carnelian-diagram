/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { PolygonCollider, KnobController, withKnob, withRotation } from "@carnelian-diagram/interaction";
import { clamp } from "@carnelian-diagram/interaction/geometry";
import { RectBaseProps } from "..";
import { withInteractiveRotatableRect, withInteractiveRotatableTextRect } from "../hocs";
import { convertPercentage, isPercentage, NumberOrPercentage, RectRotation } from "../utils";

export interface HexagonProps extends RectBaseProps {
    offset: NumberOrPercentage;
}

const knobController: KnobController<HexagonProps> = {
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

function toPolygon(props: HexagonProps) {
    let { x, y, width, height, offset } = props;

    offset = clamp(convertPercentage(offset, width), 0, width / 2);
    return [
        {x, y: y + height / 2},
        {x: x + offset, y},
        {x: x + width - offset, y},
        {x: x + width, y: y + height / 2},
        {x: x + width - offset, y: y + height},
        {x: x + offset, y: y + height}
    ];
};

const HexagonColliderFactory = (props: HexagonProps) => PolygonCollider(toPolygon(props));

export const RawHexagon: DiagramElement<HexagonProps> = function(props) {
    let { onChange, x, y, width, height, offset, ...rest } = props;
    const points = toPolygon(props);

    return (
        <polygon points={points.map(p => `${p.x},${p.y}`).join(" ")} {...rest} />
    );
};

export const Hexagon = withRotation(RawHexagon, RectRotation());

export const InteractiveHexagon = withInteractiveRotatableRect(
    withKnob(RawHexagon, knobController), 
    HexagonColliderFactory
);

export const InteractiveHexagonWithText = withInteractiveRotatableTextRect(
    withKnob(RawHexagon, knobController), 
    HexagonColliderFactory
);