/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";;
import { ACT_EDIT_TEXT, withInteractiveSquare, withInteractiveText } from "@carnelian/interaction";
import { SquareBaseProps } from "..";
import { withText } from "../hocs";
import { textEditorStyles } from "../utils";
import { MultilineText } from "./multiline-text";

export interface SquareProps extends SquareBaseProps { }

export const Square: DiagramElement<SquareProps> = function(props) {
    let { onChange, x, y, size, ...rest } = props;

    return (
        <rect x={x} y={y} width={size} height={size} {...rest} />
    );
};

export const InteractiveSquare = withInteractiveSquare(Square, {
    innerHitArea: (hitArea) => ({...hitArea, dblClickAction: ACT_EDIT_TEXT})
});

export const InteractiveSquareWithText = withText(
    InteractiveSquare,
    withInteractiveText(
        MultilineText,
        (props) => props,
        (props) => textEditorStyles(props.textStyle)
    ),
    (props) => ({
        x: props.x,
        y: props.y,
        width: props.size,
        height: props.size,
        text: props.text,
        textStyle: props.textStyle
    })
);