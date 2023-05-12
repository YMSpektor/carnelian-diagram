/** @jsxImportSource @carnelian-diagram/core */

import { DiagramElement } from "@carnelian-diagram/core";
import { ACT_EDIT_TEXT, withInteractiveRect, withInteractiveText } from "@carnelian-diagram/interaction";
import { DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE, MultilineTextStyle, TextBaseProps } from "..";
import { getTextBounds, textEditorStyles, wrapText } from "../utils";

export interface MultilineTextProps extends TextBaseProps<MultilineTextStyle> {}

export const MultilineText: DiagramElement<MultilineTextProps> = function(props) {
    let { x, y, width, height, textStyle, text } = props;
    let textElementStyle: Record<string, any>;
    let lineHeight = textStyle?.lineHeight || 1;
    if (textStyle) {
        let { textAlign, verticalAlign, lineHeight, ...rest } = textStyle;
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

    const { lines, textMetrics } = wrapText(text, width, textStyle);
    const fontHeight = textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent;

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

    let alignmentBaseline: string | undefined;
    switch (textStyle?.verticalAlign || "middle") {
        case "middle":
            y = y + height / 2 - (fontHeight * lineHeight * (lines.length - 1)) / 2;
            alignmentBaseline = "middle";
            break;
        case "bottom":
            y = y + height;
            alignmentBaseline = "text-after-edge";
            break;
        default:
            alignmentBaseline = "text-before-edge";
    }

    return (
        <text x={x} y={y} style={textElementStyle}>
            {lines.map((line, i) => (
                <tspan x={x} dy={i > 0 ? fontHeight * lineHeight : undefined} style={{alignmentBaseline}}>{line}</tspan>
            ))}
        </text>
    );
}

export const InteractiveMultilineText = withInteractiveText(
    withInteractiveRect(MultilineText, {
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