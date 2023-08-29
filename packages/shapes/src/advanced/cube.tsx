/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { KnobController, PolygonCollider, withKnob } from "@carnelian-diagram/interactivity";
import { clamp } from "@carnelian-diagram/interactivity/geometry";
import { RectBaseProps } from "..";
import { withInteractiveRotatableRect, withInteractiveRotatableTextRect } from "../hocs";
import { convertPercentage, isPercentage, NumberOrPercentage } from "../utils";

export interface CubeProps extends RectBaseProps {
    offsetX: NumberOrPercentage;
    offsetY: NumberOrPercentage;
}

const knobController: KnobController<CubeProps> = {
    hitArea: (props) => ({
        type: "knob_handle",
        cursor: "default",
        action: "knob_move"
    }),
    getPosition(props) {
        const offsetX = clamp(convertPercentage(props.offsetX, props.width), 0, props.width);
        const offsetY = clamp(convertPercentage(props.offsetY, props.height), 0, props.height);
        return {
            x: props.x + offsetX,
            y: props.y + offsetY
        }
    },
    setPosition(props, {position}) {
        let offsetX: NumberOrPercentage = position.x - props.x;
        offsetX = clamp(offsetX, 0, props.width);
        offsetX = isPercentage(props.offsetX) 
            ? props.width > 0 ? `${offsetX / props.width * 100}%` : props.offsetX
            : offsetX;
        let offsetY: NumberOrPercentage = position.y - props.y;
        offsetY = clamp(offsetY, 0, props.height);
        offsetY = isPercentage(props.offsetY) 
            ? props.height > 0 ? `${offsetY / props.height * 100}%` : props.offsetY
            : offsetY;
        return {
            ...props,
            offsetX,
            offsetY
        }
    }
}

function toPolygon(props: CubeProps) {
    let { x, y, width, height, offsetX, offsetY } = props;

    offsetX = clamp(convertPercentage(offsetX, width), 0, width);
    offsetY = clamp(convertPercentage(offsetY, height), 0, height);

    return [
        {x, y},
        {x: x + width - offsetX, y},
        {x: x + width, y: y + offsetY},
        {x: x + width, y: y + height},
        {x: x + offsetX, y: y + height},
        {x, y: y + height - offsetY}
    ];
}

const CubeColliderFactory = (props: CubeProps) => PolygonCollider(toPolygon(props));

export const Cube: DiagramElement<CubeProps> = function(props) {
    let { onChange, x, y, width, height, offsetX, offsetY, ...rest } = props;
    offsetX = clamp(convertPercentage(offsetX, width), 0, width);
    offsetY = clamp(convertPercentage(offsetY, height), 0, height);

    return (
        <>
            <polygon points={[
                    {x: x + offsetX, y: y + offsetY},
                    {x: x + width, y: y + offsetY},
                    {x: x + width, y: y + height},
                    {x: x + offsetX, y: y + height}
                ].map(p => `${p.x},${p.y}`).join(" ")} {...rest} />
            <polygon points={[
                    {x, y},
                    {x: x + width - offsetX, y},
                    {x: x + width, y: y + offsetY},
                    {x: x + offsetX, y: y + offsetY},
                ].map(p => `${p.x},${p.y}`).join(" ")} {...rest} />
            <polygon points={[
                    {x, y},
                    {x, y: y + height - offsetY},
                    {x: x + offsetX, y: y + height},
                    {x: x + offsetX, y: y + offsetY},
                ].map(p => `${p.x},${p.y}`).join(" ")} {...rest} />
        </>
    );
};

export const InteractiveCube = withInteractiveRotatableRect(
    withKnob(Cube, knobController), 
    CubeColliderFactory
);

export const InteractiveCubeWithText = withInteractiveRotatableTextRect(
    withKnob(Cube, knobController), 
    CubeColliderFactory,
    (props) => {
        const offsetX = clamp(convertPercentage(props.offsetX, props.width), 0, props.width);
        const offsetY = clamp(convertPercentage(props.offsetY, props.height), 0, props.height);
        return {
            ...props,
            x: props.x + offsetX,
            y: props.y + offsetY,
            width: props.width - offsetX,
            height: props.height - offsetY
        }
    }
);