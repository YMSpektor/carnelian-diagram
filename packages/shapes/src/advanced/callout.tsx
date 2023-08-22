/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { KnobController, PolygonCollider, withKnobs } from "@carnelian-diagram/interaction";
import { clamp } from "@carnelian-diagram/interaction/geometry";
import { RectBaseProps } from "..";
import { withInteractiveRotatableRect, withInteractiveRotatableTextRect } from "../hocs";
import { convertPercentage, isPercentage, NumberOrPercentage } from "../utils";

export interface CalloutProps extends RectBaseProps {
    tailOffset: NumberOrPercentage;
    tailWidth: NumberOrPercentage;
    tailPointerPositionX: NumberOrPercentage;
    tailPointerPositionY: NumberOrPercentage;
}

const tailOffsetKnobController: KnobController<CalloutProps, number> = {
    hitArea: {
        type: "tail_offset_knob_handle",
        cursor: "default",
        action: "tail_offset_knob_move"
    },
    getPosition(props) {
        const offset = clamp(convertPercentage(props.tailOffset, props.width), 0, props.width);
        return {
            x: props.x + offset,
            y: props.y + props.height
        }
    },
    setPosition(props, {position}) {
        let tailOffset: NumberOrPercentage = clamp(position.x - props.x, 0, props.width);
        tailOffset = isPercentage(props.tailOffset) 
            ? props.width > 0 ? `${tailOffset / props.width * 100}%` : props.tailOffset
            : tailOffset
        return {
            ...props,
            tailOffset
        }
    }
}

const tailWidthKnobController: KnobController<CalloutProps, number> = {
    hitArea: {
        type: "tail_width_knob_handle",
        cursor: "default",
        action: "tail_width_knob_move"
    },
    getPosition(props) {
        const tailOffset = clamp(convertPercentage(props.tailOffset, props.width), 0, props.width);
        const tailWidth = clamp(convertPercentage(props.tailWidth, props.width), 0, props.width - tailOffset);
        return {
            x: props.x + tailOffset + tailWidth,
            y: props.y + props.height
        }
    },
    setPosition(props, {position}) {
        const tailOffset = clamp(convertPercentage(props.tailOffset, props.width), 0, props.width);
        let tailWidth: NumberOrPercentage = clamp(position.x - props.x - tailOffset, 0, props.width - tailOffset);
        tailWidth = isPercentage(props.tailWidth) 
            ? props.width > 0 ? `${tailWidth / props.width * 100}%` : props.tailWidth
            : tailWidth
        return {
            ...props,
            tailWidth
        }
    }
}

const tailPointerKnobController: KnobController<CalloutProps, number> = {
    hitArea: {
        type: "tail_pointer_knob_handle",
        cursor: "default",
        action: "tail_pointer_knob_move"
    },
    getPosition(props) {
        const tailPointerPositionX = convertPercentage(props.tailPointerPositionX, props.width);
        const tailPointerPositionY = Math.max(0, convertPercentage(props.tailPointerPositionY, props.height));
        return {
            x: props.x + tailPointerPositionX,
            y: props.y + props.height + tailPointerPositionY
        }
    },
    setPosition(props, {position}) {
        let tailPointerPositionX: NumberOrPercentage = position.x - props.x;
        tailPointerPositionX = isPercentage(props.tailPointerPositionX)
            ? props.width > 0 ? `${tailPointerPositionX / props.width * 100}%` : props.tailPointerPositionX
            : tailPointerPositionX;
        let tailPointerPositionY: NumberOrPercentage = Math.max(0, position.y - props.y - props.height);
        tailPointerPositionY = isPercentage(props.tailPointerPositionY)
            ? props.height > 0 ? `${tailPointerPositionY / props.height * 100}%` : props.tailPointerPositionY
            : tailPointerPositionY;
        return {
            ...props,
            tailPointerPositionX,
            tailPointerPositionY
        }
    }
}

function toPolygon(props: CalloutProps) {
    let { x, y, width, height, tailOffset, tailWidth, tailPointerPositionX, tailPointerPositionY } = props;

    tailOffset = clamp(convertPercentage(tailOffset, width), 0, width);
    tailWidth = clamp(convertPercentage(tailWidth, width), 0, width - tailOffset);
    tailPointerPositionX = convertPercentage(tailPointerPositionX, props.width);
    tailPointerPositionY = Math.max(0, convertPercentage(tailPointerPositionY, props.height));
    return [
        {x, y},
        {x, y: y + height},
        {x: x + tailOffset, y: y + height},
        {x: x + tailPointerPositionX, y: y + height + tailPointerPositionY},
        {x: x + tailOffset + tailWidth, y: y + height},
        {x: x + width, y: y + height},
        {x: x + width, y}
    ];
}

const CalloutColliderFactory = (props: CalloutProps) => PolygonCollider(toPolygon(props));

export const Callout: DiagramElement<CalloutProps> = function(props) {
    const { onChange, x, y, width, height, tailOffset, tailWidth, tailPointerPositionX, tailPointerPositionY, ...rest } = props;
    const points = toPolygon(props);

    return (
        <polygon points={points.map(p => `${p.x},${p.y}`).join(" ")} {...rest} />
    );
};

export const InteractiveCallout = withInteractiveRotatableRect(
    withKnobs(Callout, tailOffsetKnobController, tailWidthKnobController, tailPointerKnobController),
    CalloutColliderFactory
);

export const InteractiveCalloutWithText = withInteractiveRotatableTextRect(
    withKnobs(Callout, tailOffsetKnobController, tailWidthKnobController, tailPointerKnobController),
    CalloutColliderFactory
);