/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { ACT_EDIT_TEXT, withInteractiveRect, withInteractiveText, withRotation } from "@carnelian-diagram/interaction";
import { RectBaseProps } from "..";
import { withText } from "../hocs";
import { textEditorStyles } from "../utils";
import { MultilineText } from "./multiline-text";

export interface RectProps extends RectBaseProps {}

export const Rect: DiagramElement<RectProps> = function(props) {
    const { onChange, ...rest } = props;

    return (
        <rect {...rest} />
    );
};

export const InteractiveRect = withInteractiveRect(Rect, {
    innerHitArea: (hitArea) => ({...hitArea, dblClickAction: ACT_EDIT_TEXT})
});

export const InteractiveRectWithText = withRotation(
    withText(
        InteractiveRect,
        withInteractiveText(
            MultilineText,
            (props) => props,
            (props) => textEditorStyles(props.textStyle)
        ),
        (props) => props
    ),
    {
        angle: (props) => 30,
        origin: (props) => ({ x: props.x + props.width / 2, y: props.y + props.height / 2 }),
        offsetElement: (props, dx, dy) => ({ ...props, x: props.x + dx, y: props.y + dy })
    }
);