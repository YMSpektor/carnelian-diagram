/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { ACT_EDIT_TEXT, withInteractiveRect, withInteractiveText } from "@carnelian-diagram/interaction";
import { DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE, TextBaseProps, TextStyle } from "..";
import { getTextBounds, textEditorStyles } from "../utils";

export interface TextProps extends TextBaseProps<TextStyle> {}

export const Text: DiagramElement<TextProps> = function(props) {
    let { x, y, width, height, textStyle, text } = props;
    let textElementStyle: Record<string, any>;
    if (textStyle) {
        let { textAlign, verticalAlign, ...rest } = textStyle;
        textElementStyle = rest;
    }
    else {
        textElementStyle = {};
    }

    textElementStyle = {
        ...textElementStyle,
        fontFamily: textStyle?.fontFamily || DEFAULT_FONT_FAMILY,
        fontSize: textStyle?.fontSize || DEFAULT_FONT_SIZE
    }

    switch (textStyle?.textAlign || "center") {
        case "center":
            x = x + width / 2;
            textElementStyle.textAnchor = "middle";
            break;
        case "right":
            x = x + width;
            textElementStyle.textAnchor = "end";
            break;
        default:
            textElementStyle.textAnchor = "start";
    }

    switch (textStyle?.verticalAlign || "middle") {
        case "middle":
            y = y + height / 2;
            textElementStyle.alignmentBaseline = "middle";
            break;
        case "bottom":
            y = y + height;
            textElementStyle.alignmentBaseline = "text-after-edge";
            break;
        default:
            textElementStyle.alignmentBaseline = "text-before-edge";
    }

    return (
        <text x={x} y={y} style={textElementStyle}>{text}</text>
    );
}

export const InteractiveText = withInteractiveText(
    withInteractiveRect(Text, {
        innerHitArea: (hitArea) => ({...hitArea, dblClickAction: ACT_EDIT_TEXT})
    }),
    (props) => props,
    (props) => textEditorStyles(props.textStyle),
    {
        onPlaceText: (props) => ({
            ...props,
            ...getTextBounds(props.x, props.y, props.text, props.textStyle)
        }),
        deleteOnEmpty: true
    }
);