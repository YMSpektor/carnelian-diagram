/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { ACT_EDIT_TEXT, CircleCollider, withInteractiveCircle, withInteractiveText } from "@carnelian-diagram/interaction";
import { CircleBaseProps } from "..";
import { withText } from "../hocs";
import { textEditorStyles } from "../utils";
import { MultilineText } from "./multiline-text";

export interface CircleProps extends CircleBaseProps { }

export const Circle: DiagramElement<CircleProps> = function(props) {
    const { onChange, x, y, radius, ...rest } = props;

    return (
        <circle cx={x} cy={y} r={radius} {...rest} />
    );
}

export const InteractiveCircle = withInteractiveCircle(
    Circle,
    {
        collider: (props) => CircleCollider({center: {x: props.x, y: props.y}, radius: props.radius}),
        innerHitArea: (hitArea) => ({...hitArea, dblClickAction: ACT_EDIT_TEXT})
    }
);

export const InteractiveCircleWithText = withText(
    InteractiveCircle,
    withInteractiveText(
        MultilineText,
        (props) => props,
        (props) => textEditorStyles(props.textStyle)
    ),
    (props) => ({
        x: props.x - props.radius,
        y: props.y - props.radius,
        width: props.radius * 2,
        height: props.radius * 2,
        text: props.text,
        textStyle: props.textStyle
    })
);