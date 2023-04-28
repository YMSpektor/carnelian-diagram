/** @jsxImportSource @carnelian/diagram */

import { DiagramElement } from "@carnelian/diagram";
import { ACT_EDIT_TEXT, withInteractiveRect, withInteractiveText } from "@carnelian/interaction";
import { DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE, TextBaseProps, TextStyle } from "..";
import { getTextBounds, textEditorStyles } from "../utils";

export interface TextProps extends TextBaseProps<TextStyle> {}

export const Text: DiagramElement<TextProps> = function(props) {
    let { x, y, width, height, style, text } = props;
    let textStyle: TextStyle & { userSelect?: "none" };
    let verticalAlign = style?.verticalAlign || "middle";
    if (style) {
        let { verticalAlign: va, ...rest } = style;
        textStyle = rest;
    }
    else {
        textStyle = {};
    }

    textStyle = {
        ...textStyle,
        fontFamily: textStyle?.fontFamily || DEFAULT_FONT_FAMILY,
        fontSize: textStyle?.fontSize || DEFAULT_FONT_SIZE,
        textAnchor: textStyle?.textAnchor || "middle",
        userSelect: "none"
    }

    switch (textStyle?.textAnchor) {
        case "middle":
            x = x + width / 2;
            break;
        case "end":
            x = x + width;
            break;
    }

    switch (verticalAlign) {
        case "middle":
            y = y + height / 2;
            textStyle.alignmentBaseline = "middle";
            break;
        case "bottom":
            y = y + height;
            textStyle.alignmentBaseline = "text-after-edge";
            break;
        default:
            textStyle.alignmentBaseline = "text-before-edge";
    }

    return (
        <text x={x} y={y} style={textStyle}>{text}</text>
    );
}

export const InteractiveText = withInteractiveText(
    withInteractiveRect(Text, {
        innerHitArea: (hitArea) => ({...hitArea, dblClickAction: ACT_EDIT_TEXT})
    }),
    (props) => props,
    (props) => textEditorStyles(props.style),
    {
        updateProps: (props) => ({
            ...props,
            ...getTextBounds(props.x, props.y, props.text, props.style)
        })
    }
);