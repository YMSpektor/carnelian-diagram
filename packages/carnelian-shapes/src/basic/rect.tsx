/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";
import { ACT_EDIT_TEXT, withInteractiveRect, withInteractiveText } from "@carnelian/interaction";
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

export const InteractiveRectWithText = withText(
    InteractiveRect,
    withInteractiveText(
        MultilineText,
        (props) => props,
        (props) => textEditorStyles(props.textStyle)
    ),
    (props) => props
);