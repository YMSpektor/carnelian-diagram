/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { KnobController, PolygonCollider, withKnob } from "@carnelian-diagram/interaction";
import { clamp } from "@carnelian-diagram/interaction/geometry";
import { RectBaseProps } from "..";
import { withInteractiveRotatableRect } from "../hocs";
import { convertPercentage, isPercentage, NumberOrPercentage } from "../utils";

export interface ArrowProps extends RectBaseProps {
    arrowWidth: NumberOrPercentage;
    arrowHeight: NumberOrPercentage;
}

const knobController: KnobController<ArrowProps, number> = {
    hitArea: (props) => ({
        type: "knob_handle",
        cursor: "default",
        action: "knob_move"
    }),
    getPosition(props) {
        const arrowWidth = clamp(convertPercentage(props.arrowWidth, props.width), 0, props.width);
        const arrowHeight = clamp(convertPercentage(props.arrowHeight, props.height), 0, props.height);
        const dy = (props.height - arrowHeight) / 2;
        return {
            x: props.x + props.width - arrowWidth,
            y: props.y + dy
        }
    },
    setPosition(props, {position}) {
        let arrowWidth: NumberOrPercentage = clamp(props.x + props.width - position.x, 0, props.width);
        arrowWidth = isPercentage(props.arrowWidth) 
            ? props.width > 0 ? `${arrowWidth / props.width * 100}%` : props.arrowWidth
            : arrowWidth;
        let arrowHeight: NumberOrPercentage = clamp((props.y + props.height / 2 - position.y) * 2, 0, props.height);
        arrowHeight = isPercentage(props.arrowHeight) 
            ? props.height > 0 ? `${arrowHeight / props.height * 100}%` : props.arrowHeight
            : arrowHeight
        return {
            ...props,
            arrowWidth,
            arrowHeight
        }
    }
}

function toPolygon(props: ArrowProps) {
    let { x, y, width, height, arrowWidth, arrowHeight } = props;
    arrowWidth = clamp(convertPercentage(arrowWidth, width), 0, width);
    arrowHeight = clamp(convertPercentage(arrowHeight, height), 0, height);
    const dy = (height - arrowHeight) / 2;

    return [
        {x, y: y + dy},
        {x: x + width - arrowWidth, y: y + dy},
        {x: x + width - arrowWidth, y},
        {x: x + width, y: y + height / 2},
        {x: x + width - arrowWidth, y: y + height},
        {x: x + width - arrowWidth, y: y + height - dy},
        {x, y: y + height - dy}
    ];
}

const ArrowColliderFactory = (props: ArrowProps) => PolygonCollider(toPolygon(props));

export const Arrow: DiagramElement<ArrowProps> = function(props) {
    const { onChange, x, y, width, height, arrowWidth, arrowHeight, ...rest } = props;
    const points = toPolygon(props);

    return (
        <polygon points={points.map(p => `${p.x},${p.y}`).join(" ")} {...rest} />
    );
};

export const InteractiveArrow = withInteractiveRotatableRect(
    withKnob(Arrow, knobController),
    ArrowColliderFactory
);