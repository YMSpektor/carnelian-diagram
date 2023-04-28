/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";
import { ACT_EDIT_TEXT, EllipseCollider, withInteractiveRect, withInteractiveText } from "@carnelian/interaction";
import { RectBaseProps } from "..";
import { withText } from "../hocs";
import { textEditorStyles } from "../utils";
import { MultilineText } from "./multiline-text";

export interface EllipseProps extends RectBaseProps {}

export const Ellipse: DiagramElement<EllipseProps> = function(props) {
    const { onChange, x, y, width, height, ...rest } = props;
    const rx = width / 2;
    const ry = height / 2;
    const cx = x + rx;
    const cy = y + ry;

    return (
        <ellipse {...{cx, cy, rx, ry}} {...rest} />
    );
};

export const InteractiveEllipse = withInteractiveRect(
    Ellipse,
    {
        collider: (props) => EllipseCollider({center: {x: props.x + props.width / 2, y: props.y + props.height / 2}, rx: props.width / 2, ry: props.height / 2}),
        innerHitArea: (hitArea) => ({...hitArea, dblClickAction: ACT_EDIT_TEXT})
    }
);

export const InteractiveEllipseWithText = withText(
    InteractiveEllipse,
    withInteractiveText(
        MultilineText,
        (props) => props,
        (props) => textEditorStyles(props.style)
    ),
    (props) => ({
        x: props.x,
        y: props.y,
        width: props.width,
        height: props.height,
        text: props.text,
        style: props.textStyle
    })
);