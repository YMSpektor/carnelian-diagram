/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { ACT_EDIT_TEXT, withInteractiveRect, withInteractiveRotation, withInteractiveText, withRotation } from "@carnelian-diagram/interaction";
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

export const InteractiveRect = withInteractiveRect(Rect);

export const InteractiveRectWithText = withRotation(
    withInteractiveRotation(
        withText(
            withInteractiveRect(Rect, {
                innerHitArea: (hitArea) => ({...hitArea, dblClickAction: ACT_EDIT_TEXT})
            }),
            withInteractiveText(
                MultilineText,
                (props) => props,
                (props) => textEditorStyles(props.textStyle)
            ),
            (props) => props
        ),
        {
            origin: (props) => ({ x: props.x + props.width / 2, y: props.y + props.height / 2 }),
            handleAnchor: (props) => ({ x: props.x + props.width, y: props.y }),
            handleOffset: 20,
            getRotation: (props) => props.rotation || 0,
            setRotation: (props, rotation) => ({...props, rotation })
        }
    ),
    {
        angle: (props) => props.rotation || 0,
        origin: (props) => ({ x: props.x + props.width / 2, y: props.y + props.height / 2 }),
        offsetElement: (props, dx, dy) => ({ ...props, x: props.x + dx, y: props.y + dy })
    }
);